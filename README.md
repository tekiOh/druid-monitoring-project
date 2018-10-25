# DRUID-MONITORING PROJECT 
##  소개
> 분산 저장소인 DRUID의 상태를 모니터링하는 웹 어플리케이션

최근에 각광받는 분산 저장소인 DRUID에는 분산 환경에 대한 모니터링 기능이 부족하다. 따라서 주요 지표들을 모니터링할수 있는 웹 어플리케이션을 제작하였다. 이를 통해 분산되어있는 서버와 노드에 대한 정보를 알 수 있다.

## 요구사항
1.  python 3.6.x
2.  pip3
3.  virtualenv
4.  nodejs higher than 8.x.x

## 설치 방법
1.  clone the project
2.  virtualenv {virtualevne_name}
3.  source ./{virtualevne_name}/bin/activate
4.  pip install -r requirement.txt
5.  npm install -f

## 실행 방법
1.  npm run dev
2.  python manage.py {ip}:{port}


## 프로젝트 일정
> 분석, 기획, 개발, 배포, QA를 진행

![](https://github.com/pouder-Man/druid-monitoring-project/blob/master/image/00_milestone.PNG)


1. 분석
	> metatron, druid 분석 및 사용, 경쟁사 분석
2. 기획
	> 기획서, 기능 명세서, 지표 선정, WBS
3. 개발
	> back-end, front-end, publishing로 역할을 나눠 개발
	
## 프로젝트 구조
 > kafka, druid, django, react

![](https://github.com/pouder-Man/druid-monitoring-project/blob/master/image/01_architecture.PNG)
![](https://github.com/pouder-Man/druid-monitoring-project/blob/master/image/02_architecture.PNG)
![](https://github.com/pouder-Man/druid-monitoring-project/blob/master/image/03_architecture.PNG)
![](https://github.com/pouder-Man/druid-monitoring-project/blob/master/image/04_architecture.PNG)

1. druid

	> target system, data store

2. kafka
	
	> distributed streaming platfrom
	
3. django
	
	> back-end
	
4. react

	> front-end
	
5. e-chart

	> visualization chart library

## 기능

1. overviews
	* 최근 한시간의 상태
	* 최근 한시간과 그 직전 한시간의 차이(KPI)

2. nodes
	* 사용자가 원하는 노드의 상태를 확인할수있음
	* 서버, 노드, 구간, granularity 선택가능

## 결과

![](https://github.com/pouder-Man/druid-monitoring-project/blob/master/image/07_result.jpg)
![](https://github.com/pouder-Man/druid-monitoring-project/blob/master/image/08_result.jpg)
![](https://github.com/pouder-Man/druid-monitoring-project/blob/master/image/09_result.jpg)
