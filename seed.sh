#!/bin/bash
BASE_URL="http://localhost:3000/api"

echo "=== 创建展馆 ==="
curl -s -X POST $BASE_URL/halls -H "Content-Type: application/json" -d '{"name":"一号馆","location":"上海新国际博览中心","boothCount":100,"description":"主展馆"}'
echo ""
curl -s -X POST $BASE_URL/halls -H "Content-Type: application/json" -d '{"name":"二号馆","location":"上海新国际博览中心","boothCount":80,"description":"副展馆"}'
echo ""

echo "=== 创建工人 ==="
curl -s -X POST $BASE_URL/workers -H "Content-Type: application/json" -d '{"name":"张师傅","phone":"13800138001","type":"carpenter","idCard":"310101199001011234","hasCertificate":true,"certificateNumber":"CERT-001","hasNightWorkPermit":true,"isAvailable":true,"skills":"木工,搭建"}'
echo ""
curl -s -X POST $BASE_URL/workers -H "Content-Type: application/json" -d '{"name":"李师傅","phone":"13800138002","type":"carpenter","idCard":"310101199102022345","hasCertificate":true,"certificateNumber":"CERT-002","hasNightWorkPermit":false,"isAvailable":true,"skills":"木工,油漆"}'
echo ""
curl -s -X POST $BASE_URL/workers -H "Content-Type: application/json" -d '{"name":"王电工","phone":"13800138003","type":"electrician","idCard":"310101198903033456","hasCertificate":true,"certificateNumber":"ELEC-001","hasNightWorkPermit":true,"isAvailable":true,"skills":"强电,弱电"}'
echo ""
curl -s -X POST $BASE_URL/workers -H "Content-Type: application/json" -d '{"name":"赵美工","phone":"13800138004","type":"decorator","idCard":"310101199204044567","hasCertificate":false,"hasNightWorkPermit":false,"isAvailable":true,"skills":"美工,喷绘"}'
echo ""
curl -s -X POST $BASE_URL/workers -H "Content-Type: application/json" -d '{"name":"陈司机","phone":"13800138005","type":"forklift_driver","idCard":"310101198805055678","hasCertificate":true,"certificateNumber":"FORK-001","hasNightWorkPermit":true,"isAvailable":true,"skills":"叉车驾驶"}'
echo ""

echo "=== 创建项目 ==="
curl -s -X POST $BASE_URL/projects -H "Content-Type: application/json" -d '{"name":"2024汽车展","boothNumber":"A101","boothArea":100,"hallId":1,"entryTime":"2024-06-15T08:00:00","buildDeadline":"2024-06-18T18:00:00","carpenterNeeded":3,"electricianNeeded":2,"decoratorNeeded":2,"forkliftNeeded":1,"nightWorkRequired":true,"status":"in_progress","projectManager":"周经理","clientName":"上海汽车集团"}'
echo ""
curl -s -X POST $BASE_URL/projects -H "Content-Type: application/json" -d '{"name":"科技博览会","boothNumber":"B205","boothArea":80,"hallId":2,"entryTime":"2024-06-20T09:00:00","buildDeadline":"2024-06-22T17:00:00","carpenterNeeded":2,"electricianNeeded":1,"decoratorNeeded":3,"forkliftNeeded":1,"nightWorkRequired":false,"status":"pending","projectManager":"吴经理","clientName":"未来科技公司"}'
echo ""
curl -s -X POST $BASE_URL/projects -H "Content-Type: application/json" -d '{"name":"家具展览会","boothNumber":"A050","boothArea":120,"hallId":1,"entryTime":"2024-06-10T08:00:00","buildDeadline":"2024-06-12T18:00:00","dismantleStartTime":"2024-06-16T18:00:00","carpenterNeeded":4,"electricianNeeded":2,"decoratorNeeded":2,"forkliftNeeded":2,"nightWorkRequired":false,"status":"accepted","projectManager":"郑经理","clientName":"宜家家居"}'
echo ""

echo "=== 完成 ==="
