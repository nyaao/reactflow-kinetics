from functools import reduce
from lark import Lark, Transformer
import math, os



class MyTransfomer(Transformer):
    def __init__(self, K: list[float], Y: list[float], visit_tokens: bool = True) -> None:
        super().__init__(visit_tokens)

        self.k=K
        self.y=Y

    def add(self, tree):
        print(tree)
    def factor(self, tree):
        return tree[0]
    def number(self,tree):
        return float(tree[0])
    def index(self,tree):
        return int(tree[0])
    def kvalue(self,tree):
        return self.k[tree[0]]
    def yvalue(self,tree):
        return self.y[tree[0]]
        
    def minus_number(self,tree):
        return -1*float((tree[0]))
    def minus_kvalue(self,tree):
        return -1*float((tree[0]))

    
    def mul(self,tree):
        return reduce(lambda x,y: x*y, tree)
    def add(self,tree):
        return reduce(lambda x,y: x+y, tree)
    def div(self,tree):
        return reduce(lambda x,y: x/y, tree)    
    def sub(self,tree):
        return reduce(lambda x,y: x-y, tree)
    def pow(self, tree):
        return reduce(lambda x,y: math.pow(x,y), tree)
    
class EquationParser(MyTransfomer):
    def __init__(self, K: list[float], Y: list[float], visit_tokens: bool = True) -> None:
        super().__init__(K, Y, visit_tokens)
        self.k = K
        self.y = Y
        self.parser = Lark(
            open(os.path.dirname(__file__)+"/grammer.lark"),
            start='value',
            parser='lalr', 
            transformer=MyTransfomer(K,Y))

    def parse(self,TEXT):
        return self.parser.parse(TEXT)


if __name__=='__main__':

    k = [10.,20.,30.]
    y = [11.,22.,33.]
    Eparser=EquationParser(k,y)

    text="2+2" # 4.0
    text="2*3" # 6.0
    text="2/3" # 0.66666666
    text="2-7" # -5.0
    text="-2+2" # 0.0
    text="-2^2" # 4.0
    text="-2^3" # -8.0
    text="-2*-2"# 4.0
    text="-2*-2"# 4.0
    text="(1+2)*3" # 9.0
    text="1+2*3" # 7.0
    text="1+(1+2)*3" # 10.0
    text="2*1+2*3" # 8.0  
    text="k[0]" # 10.0
    text="Y[1]" # 22.0
    text=("(1+2)^2") # 9.0
    text=("(1+2)^-2") # 0.11111111 (1/9)
    text=("0.5") # error 小数点は使用不可
    text=("1/2") # 0.5
    text=("(1+2)^1/2") # 1.5
    text=("(1+2)^(1/2)") # 1.7320508075688772 3の二乗根
    text=("k[4]")
    print(Eparser.parse(text))
