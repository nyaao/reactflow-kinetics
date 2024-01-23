import sympy
import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp
import sys
import re

k = [5,0.2]
init_y = [0.1, 0, 0.1, 0, 0, 0]
input_strs = ['-k[1]*Y[1]*Y[3]','+k[1]*Y[1]*Y[3]-k[2]*Y[2]*Y[4]','-k[1]*Y[1]*Y[3]','+k[1]*Y[1]*Y[3]-k[2]*Y[2]*Y[4]','+k[2]*Y[2]*Y[4]','+k[2]*Y[2]*Y[4]'] # expressionsより

k_num = len(k) # reactionノードの数
Y_num = len(init_y) # materialノードの数
k_symbols = ([sympy.Symbol('k'+str(i+1)) for i in range(k_num)])
Y_symbols = ([sympy.Symbol('Y'+str(i+1)) for i in range(Y_num)])
equation_strs = [re.sub(r'(\w)\[(\d+)\]', r'\1\2', instr) for instr in input_strs] # '[',']'がsympyでうまく処理できないので除去
symbolic_exprs = [sympy.sympify(eqstr) for eqstr in equation_strs]
numpy_exprs = [sympy.lambdify((*k_symbols, *Y_symbols),symbexpr,'numpy') for symbexpr in symbolic_exprs]

def func(t, x):
    return [np_expr(*k,*x) for np_expr in numpy_exprs]

time = {"min":0,"max":50}
time_ = np.linspace(time["min"],time["max"],1000+1)
sol = solve_ivp(func, [time_[0],time_[-1]], init_y, method='RK45',dense_output=True)

plt.plot(sol.t,sol.y[0,:],'r,-')
plt.plot(sol.t,sol.y[1,:],'g,-')
plt.plot(sol.t,sol.y[4,:],'b,-')
# plt.plot(sol.t,1.0*np.exp(-k[0]*sol.t),'--')
plt.savefig('/code/result.png')