apiVersion: v1
kind: Namespace
metadata:
  name: redispy
  labels:
    name: redispy
---
apiVersion: v1
kind: Service
metadata:
  name: www
  labels:
    name: www
  namespace: redispy
spec:
  ports:
  - name: www
    port: 8080
  selector:
    name: www
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: www
  labels:
    name: www
  namespace: redispy
spec:
  replicas: 1
  selector:
    matchLabels:
      name: www
  template:
    metadata:
      labels:
        name: www
    spec:
      containers:
      - name: www
        image: ${ecr_url}
        ports:
        - name: www
          containerPort: 8080
        env:
        - name: REDIS_HOST
          value: ${redis_endpoint}
        - name: REDIS_PASSWORD
          value: '${redis_password}'
        - name: ALLOWED_HOSTS
          value: "['*']"
