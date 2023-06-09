import json
import networkx as nx

id_offset=1000 #1000以上はreactionノードのID

class NX4ReactFlow:
    def __init__(self,NODES,EDGES) -> None:
        self.G = nx.MultiDiGraph()
        self.setData2Graph(NODES,EDGES)

    def setData2Graph(self,NODES,EDGES):
        # グラフにエッジデータを登録
        EDGES = sorted(EDGES, key=lambda x: x['source'])
        
        for i in range(len(EDGES)):
            s=int(EDGES[i]["source"][1:]) if EDGES[i]["source"][0]!='r' else int(EDGES[i]["source"][1:]) + id_offset
            t=int(EDGES[i]["target"][1:]) if EDGES[i]["target"][0]!='r' else int(EDGES[i]["target"][1:]) + id_offset
            data=EDGES[i]["data"]
            nx.add_path(self.G, [int(s), int(t)],data=data)

        # グラフにノードデータを登録
        NODES = sorted(NODES, key=lambda x: x['id'])
        for n in self.G.nodes:
            nodeid = list(filter(lambda x: x["id"]==str("r"+str(n-1000) if n>id_offset else "m"+str(n)),NODES))[0]["id"]
            self.G.nodes[n]["id"]=nodeid
            self.G.nodes[n]["label"]=nodeid
            nodetype = list(filter(lambda x: x["id"]==str("r"+str(n-1000) if n>id_offset else "m"+str(n)),NODES))[0]["type"]
            self.G.nodes[n]["type"]=nodetype
            nodedata = list(filter(lambda x: x["id"]==str("r"+str(n-1000) if n>id_offset else "m"+str(n)),NODES))[0]["data"]
            self.G.nodes[n]["data"]=nodedata


    def setSchemID(self):
        integrand_id=0
        reaction_id=0
        for n in list(self.G):            
            if self.G.nodes[n]["type"] == 'reaction':
                self.G.nodes[n]["data"]["reaction_id"]=reaction_id
                reaction_id+=1
            else:
                self.G.nodes[n]["data"]["integrand_id"]=integrand_id
                integrand_id+=1


    def getReactionRateFactor(self,NODE):
        term = ""
        for pn in list(self.G.predecessors(NODE)):
            if self.G.nodes[pn]["type"]!="reaction": #react側でreactionにならないようにするが念の為
                term+="*Y["+str(self.G.nodes[pn]["id"]).replace("m","")+"]"
        return term

    def setReactionRateTerm(self):
        for n in list(nx.topological_sort(self.G)):
            term =""
            if self.G.nodes[n]["type"]=='reaction':
                term+="k["+str(self.G.nodes[n]["id"]).replace("r","")+"]"
                term+=self.getReactionRateFactor(n)
            self.G.nodes[n]["data"]["term"]=term


    def setReactionRateEquation(self):
        for n in list(nx.topological_sort(self.G)):
            if self.G.nodes[n]["type"]=='reactant':
                self.G.nodes[n]["data"]["equation"] = "".join(["-" + self.G.nodes[sn]["data"]["term"] for sn in list(self.G.successors(n))])
            elif self.G.nodes[n]["type"]=='product':
                self.G.nodes[n]["data"]["equation"] = "".join(["+" + self.G.nodes[pn]["data"]["term"] for pn in list(self.G.predecessors(n))])
            elif self.G.nodes[n]["type"]=='intermediate':
                self.G.nodes[n]["data"]["equation"] = "".join(["+" + self.G.nodes[pn]["data"]["term"] for pn in list(self.G.predecessors(n))]) + "".join(["-" + self.G.nodes[sn]["data"]["term"] for sn in list(self.G.successors(n))])
            else:
                self.G.nodes[n]["data"]["equation"] = ""           


def lambda_handler(event, context):
    #データ格納
    nodes = event["body"]["nodes"]
    edges = event["body"]["edges"]

    print("--------------------------------------------------------")
    
    nx4rf = NX4ReactFlow(nodes,edges)
    nx4rf.setReactionRateTerm()
    nx4rf.setReactionRateEquation()
    
    nodes = [nx4rf.G.nodes[n] for n in nx4rf.G.nodes]
    edges = [nx4rf.G.edges[e] for e in nx4rf.G.edges]

    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!'),
        'nodes':json.dumps(nodes),
        'edges':json.dumps(edges),
    }
