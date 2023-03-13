from .models import SampleModel                          # モデル呼出
from rest_framework.generics import ListCreateAPIView    # API
from rest_framework.views import APIView    # API
from rest_framework.response import Response
from .serializers import SampleSerializer                # APIで渡すデータをJSON,XML変換
from . import myNetworkX

class api(ListCreateAPIView):
    # 対象とするモデルのオブジェクトを定義
    queryset = SampleModel.objects.all()

    # APIがデータを返すためのデータ変換ロジックを定義
    serializer_class = SampleSerializer

    # 認証
    permission_classes = []

class apitest(APIView):
    def get(self, request, format=None):
        return Response("test")

    def post(self, request, format=None):
        graph = myNetworkX.NX4ReactFlow(request.data["Nodes"],request.data["Edges"])
        graph.test()
        return Response("post")