from scipy.integrate import solve_ivp
import numpy as np
from . import MyTransformer
# import MyTransfomer
import sys
import optuna
import re

class DiffEqOptTool():

    def __init__(self,FUNC,NUMPARAMS,TIME,INITY) -> None:
        self.diff_func = FUNC
        self.time_=TIME
        self.init_y=INITY
        self.num_params=NUMPARAMS

    def solveDiffEq(self,K):
        # ソルバーの設定
        solver = solve_ivp(self.diff_func,[self.time_[0],self.time_[-1]],self.init_y,args=(K,),dense_output=True)

        # 微分方程式を解いて辞書変数に格納
        sol = list(solver.sol(self.time_))
        sols = zip(*sol)
        rdic = dict(zip(self.time_,sols))
        return rdic
    
    def searchNearestKey(self,ORGKEY,CANDKEYS):
        min_err = sys.float_info.max
        nearest_key = 0
        for ck in CANDKEYS:
            err = (ck - ORGKEY) ** 2 
            if err < min_err:
                min_err = err
                nearest_key = ck
        return nearest_key

    def calcError(self,EXDATA,CALCDATA):    
        # 実験データとの誤差を集計
        sum_err = 0
        for exk in EXDATA.keys():
            if exk in CALCDATA.keys():
                tmpkey = exk
            else:
                tmpkey = self.searchNearestKey(exk,CALCDATA.keys())
            for yi in range(len(self.init_y)):
                sum_err += (EXDATA[exk][yi] - CALCDATA[tmpkey][yi]) ** 2
        return sum_err

    def runOptuna(self,EXDATA,PRANGE,NTRIAL=100):
        def objective(trial):
            params = []
            for i in range(self.num_params):
                params.append(trial.suggest_float("params"+str(i),PRANGE[i][0],PRANGE[i][1]))
            calc_data_dic = self.solveDiffEq(params)
            return self.calcError(EXDATA,calc_data_dic)

        study = optuna.create_study()
        study.optimize(objective,n_trials=NTRIAL)
        return list(study.best_params.values())

def lambda_handler(event, context):
    #データ格納
    expressions = event["body"]["scheme"]
    init_y = event["body"]["init_y"]
    org_params = event["body"]["params"]

    print(init_y)
    print(expressions)
    print(org_params)

    """
    init_y = sorted({k.replace('Y',''):init_y[k] for k in tmpkeys}.items()) #init_yをキーでソート
    init_y = [y[1] for y in init_y] #ソートした結果をリストに格納
    expressions = sorted({k.replace('Y',''):scheme[k] for k in tmpkeys}.items()) #schemeをキーでソート
    expressions = [re.sub('^\+','',expression[1]) for expression in expressions]
    params = sorted({k.replace('k',''):params[k] for k in params.keys()}.items()) #paramsをキーでソート
    org_params = [k[1] for k in params] #ソートした結果をリストに格納
    """

    Yindex_max = int(re.search(r'[0-9]+',max(init_y.keys())).group())
    init_y_input=[]
    for yi in range(Yindex_max+1):
        try:
            init_y_input.append(init_y['Y['+str(yi)+']'])
        except:
            init_y_input.append(0)

    Exprindex_max = int(re.search(r'[0-9]+',max(expressions.keys())).group())
    expressions_input=[]
    for ei in range(Exprindex_max+1):
        try:
            expressions_input.append(re.sub('^\+','',expressions['Y['+str(ei)+']']))
        except:
            expressions_input.append("1-1")

    OrgParamindex_max = int(re.search(r'[0-9]+',max(org_params.keys())).group())
    org_params_input=[]
    for ki in range(OrgParamindex_max+1):
        try:
            org_params_input.append(org_params['k['+str(ki)+']'])
        except:
            org_params_input.append(0)

    print("-----------------------------------------")

    print(init_y_input)
    print(expressions_input)    
    print(org_params_input)
    
    # init_y = [100,100,0]
    # org_params = [0.1]
    # print(rereading)
    # expressions = [re.sub('^\+','',expression) for expression in scheme.values()]
    # print(expressions)

    time_ = np.linspace(0,100,101)
    def funcEq(T, Y, PARAMS):
        parser = MyTransformer.EquationParser(PARAMS,Y) # parseする前に各ステップにおけるYを格納する必要があるため、ここでパーサーをインスタンス化する必要がある
        ret = [parser.parse(expr) for expr in expressions_input]
        return ret
    
    solver = DiffEqOptTool(funcEq,len(org_params_input),time_,init_y_input)
    return solver.solveDiffEq(org_params_input)


if __name__=='__main__':
    time_ = np.linspace(0,100,101)
    init_y = [100,100,0,0,0]
    org_params = [0.1,0.2]

    expressions = ["- k[0] * Y[0] * Y[1]",
                    "- k[0] * Y[0] * Y[1]",
                    "k[0] * Y[0] * Y[1] - k[1] * Y[2] * Y[3]",
                    "k[0] * Y[0] * Y[1] - k[1] * Y[2] * Y[3]",
                    "k[1] * Y[2] * Y[3]"]

    # init_y=[0, 0.1, 0, 0, 0.1]
    # expressions = ['1-1', '-k[1]*Y[1]*Y[4]', 'k[1]*Y[1]*Y[4]', 'k[1]*Y[1]*Y[4]', '-k[1]*Y[1]*Y[4]']
    # org_params = [0, 0.05]

    def funcEq(T, Y, PARAMS):
        parser = MyTransformer.EquationParser(PARAMS,Y) # parseする前に各ステップにおけるYを格納する必要があるため、ここでパーサーをインスタンス化する必要がある
        ret = [parser.parse(expr) for expr in expressions]
        return ret

    solver = DiffEqOptTool(funcEq,len(org_params),time_,init_y)
    print(solver.solveDiffEq(org_params))