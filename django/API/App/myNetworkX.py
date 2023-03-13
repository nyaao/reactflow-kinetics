import networkx as nx
import matplotlib.pyplot as plt

class NX4ReactFlow():
    def __init__(self,NODES,EDGES) -> None:
        self.G = nx.MultiDiGraph()
        self.setData2Graph(NODES,EDGES)
        self.invG = nx.reverse(self.G)

    def setData2Graph(self,NODES,EDGES):
        # グラフにエッジデータを登録
        EDGES = sorted(EDGES, key=lambda x: x['source'])        
        
        for i in range(len(EDGES)):
            s=EDGES[i]["source"]
            t=EDGES[i]["target"]
            data=EDGES[i]["data"]
            nx.add_path(self.G, [int(s), int(t)],data=data)

        # グラフにノードデータを登録
        NODES = sorted(NODES, key=lambda x: x['id'])
        for n in self.G.nodes:
            nodeid = [dict for dict in NODES if dict["id"]==str(n)][0]["id"]
            self.G.nodes[n]["id"]=nodeid
            self.G.nodes[n]["label"]=nodeid

    def saveGraphImg(self):
        nx.draw_circular(self.G)
        plt.savefig("random.png")
        plt.close() #一旦閉じる！！！

    #self.invG.neighbors(n):
    def getInvNeighbors(self,n,l):
        if self.G.in_degree(n) == 0:
            return

        for nei in self.invG.neighbors(n):
            self.getInvNeighbors(nei,l)
            print(nei)
        l.append({n:[nei for nei in self.invG.neighbors(n)]})

        return

    def getSumID(self,n):
        if self.G.in_degree(n) == 0:
            return

        for nei in self.invG.neighbors(n):
            self.getSumID(nei)
            print(nei)
        self.G.nodes[n]["sum"]=sum([nei for nei in self.invG.neighbors(n)])
        # self.G.nodes[n]["sum"]=sum([self.getSumID(nei) for nei in self.invG.neighbors(n)])

    def test2(self,n,l):
        if self.G.in_degree(n) == 0:
            return

        return [self.getInvNeighbors(nei,l) for nei in self.invG.neighbors(n)]

        
        

        
                
    
    def test(self):
        lis = []
        # # print(self.G.in_degree(6))
        # self.getInvNeighbors(14,lis)
        # print(lis)
        # # print(self.getInvNeighbors([6]))
        # self.getSumID(14)
        
        # for n in self.G.nodes:
        #     print(n,self.G.nodes[n])

        self.test2(14,lis)
        print(lis)
            
                
            

    def calc(NODES,EDGES):
        print(NODES)
        pass