from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

def overview(request):
    return render(request, 'frontend/index.html')
# def nodes_tab(request):
#     return render(request, 'frontend/nodes.html')
