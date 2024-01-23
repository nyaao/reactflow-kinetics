from scipy.integrate import solve_ivp
import numpy as np
from . import MyTransformer
# import MyTransfomer
import sympy
import sys
import optuna
import re

def lambda_handler(event, context):
    #データ格納
    expressions = event["body"]["scheme"]
    init_y = event["body"]["init_y"]
    org_params = event["body"]["params"]
    time = event["body"]["time"]

    print("---------------受信データ確認----------------------------------------------")
    print('【init_y】',init_y)
    print('【expressions】', expressions)
    print('【org_params】', org_params)
    print('【time】', time)

    print("-------------計算用inputデータ確認-----------------------------------------")

    Yindex_max = max([int(yi.replace("Y[","").replace("]","")) for yi in init_y.keys()])
    init_y_input=[]
    for yi in range(Yindex_max+1):
        try:
            init_y_input.append(init_y['Y['+str(yi)+']'])
        except:
            init_y_input.append(0)

    Exprindex_max = max([int(expri.replace("Y[","").replace("]","")) for expri in expressions.keys()])
    expressions_input=[]
    for ei in range(Exprindex_max+1):
        try:
            expressions_input.append(re.sub('^\+','',expressions['Y['+str(ei)+']']))
        except:
            expressions_input.append("1-1")

    OrgParamindex_max = max([int(ki.replace("k[","").replace("]","")) for ki in org_params.keys()])
    org_params_input=[]
    for ki in range(OrgParamindex_max+1):
        try:
            org_params_input.append(org_params['k['+str(ki)+']'])
        except:
            org_params_input.append(0)

    print('【init_y_input】',init_y_input)
    print('【expressions_input】', expressions_input)    
    print('【org_params_input】', org_params_input)
    
    print('-----------------sympy+scipyの処理-----------------------------------------')
    def calcby_sympy(params):
        k=params[1:]
        init_y = init_y_input[1:]
        input_strs = expressions_input[1:]

        k_num = len(k)
        Y_num = len(init_y)
        k_symbols = ([sympy.Symbol('k'+str(i+1)) for i in range(k_num)])
        Y_symbols = ([sympy.Symbol('Y'+str(i+1)) for i in range(Y_num)])
        equation_strs = [re.sub(r'(\w)\[(\d+)\]', r'\1\2', instr) for instr in input_strs] # '[',']'がsympyでうまく処理できないので除去
        symbolic_exprs = [sympy.sympify(eqstr) for eqstr in equation_strs]
        numpy_exprs = [sympy.lambdify((*k_symbols, *Y_symbols),symbexpr,'numpy') for symbexpr in symbolic_exprs]

        def ode_func(t, x):
            return [np_expr(*k,*x) for np_expr in numpy_exprs]

        time_ = np.linspace(time["min"],time["max"],1000+1)
        solver = solve_ivp(ode_func, [time_[0],time_[-1]], init_y, method='RK45',dense_output=True)
        
        sol = list(solver.sol(time_))
        sols = zip(*sol)
        calc_results = dict(zip(time_,sols))
        updated_calc_results = {key: (0.0, *values) for key, values in calc_results.items()}
        return updated_calc_results
    calc_results = calcby_sympy(org_params_input)

    print("--------------受信データ確認(実験データ)-----------------------------------")
    exp_data = event["body"]["expData"]
    selected_data = event["body"]["selectedData"]
    exp_times = [data['time'] for data in event["body"]["expData"]]
    print('【exp_data】',exp_data)
    print('【selected_data】',selected_data)
    print('【exp_times】',exp_times)

    print("--------------optunaによるパラメータフィッティング-------------------------")
    opt_param = event["body"]["optParam"]
    print('【opt_param】',opt_param)

    if opt_param!={}:
        def objective(trial):
            def calc_error():
                selected_key_index = [(key,int(key.replace('Y[','').replace(']',''))) for key in selected_data.keys() if selected_data[key]]
                calc_data_at_exptimes = {time:calc_results[min(calc_results.keys(),key=lambda x: abs(x-time))] for time in exp_times}

                err_sum = 0
                for exptime in exp_times:
                    for keyindex in selected_key_index:
                        err_sum += (list(filter(lambda x: x["time"]==exptime,exp_data))[0][keyindex[0]] - calc_data_at_exptimes[exptime][keyindex[1]])**2
                return err_sum
        
            k1 = trial.suggest_float(opt_param["id"],opt_param["min"],opt_param["max"])
            trial_params = org_params_input.copy()
            trial_params[int(re.sub(r'\D', '',opt_param["id"]))] = k1
            calc_results = calcby_sympy(trial_params)
            return calc_error()
        
        study = optuna.create_study()
        study.optimize(objective, n_trials=50)

        print("【最適化後パラメータ】",study.best_params)
        index = int(re.sub(r'\D', '',opt_param["id"]))
        print(study.best_params)
        optimized_param = study.best_params['r'+str(index)]
        org_params_input[index]=optimized_param
        calc_results = calcby_sympy(org_params_input)

        recommend_opt_param = {'id': opt_param['id'], 'min': optimized_param*0.8, 'max': optimized_param*1.2}
        return [calc_results,org_params_input,recommend_opt_param]
    
    return [calc_results,org_params_input]
