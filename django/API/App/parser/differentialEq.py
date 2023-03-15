from scipy.integrate import solve_ivp
import numpy as np
from . import MyTransfomer
import sys
import optuna

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
    rereading = event["body"]["rereading"]
    scheme = event["body"]["scheme"]

    time_ = np.linspace(0,100,101)
    init_y = [100,100,0,0,0]
    org_params = [0.1,0.2]

    print(rereading)
    print(scheme)
    

if __name__=='__main__':
    time_ = np.linspace(0,100,101)
    init_y = [100,100,0,0,0]
    org_params = [0.1,0.2]

    expressions = ["- k[0] * Y[0] * Y[1]",
                    "- k[0] * Y[0] * Y[1]",
                    "k[0] * Y[0] * Y[1] - k[1] * Y[2] * Y[3]",
                    "k[0] * Y[0] * Y[1] - k[1] * Y[2] * Y[3]",
                    "k[1] * Y[2] * Y[3]"]


    def funcEq(T, Y, PARAMS):
        parser = MyTransfomer.EquationParser(PARAMS,Y) # parseする前に各ステップにおけるYを格納する必要があるため、ここでパーサーをインスタンス化する必要がある
        ret = [parser.parse(expr) for expr in expressions]
        return ret

    solver = DiffEqOptTool(funcEq,len(org_params),time_,init_y)
    print(solver.solveDiffEq(org_params))