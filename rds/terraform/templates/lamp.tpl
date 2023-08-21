apiVersion: v1
kind: Namespace
metadata:
  name: lamp
  labels:
    name: lamp
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: www
  labels:
    name: www
  namespace: lamp
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
          containerPort: 80
        env:
        - name: MYSQL_HOST
          value: ${mysql_host}
        - name: MYSQL_USER
          value: ${mysql_user}
        - name: MYSQL_PASSWORD
          value: ${mysql_pw}
        - name: MYSQL_DB
          value: ${mysql_db}
---
apiVersion: v1
kind: Service
metadata:
  name: www
  labels:
    name: www
  namespace: lamp
spec:
  ports:
  - name: www
    port: 80
  selector:
    name: www
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
  labels:
    name: mysql
  namespace: lamp
spec:
  replicas: 1
  selector:
    matchLabels:
      name: mysql
  template:
    metadata:
      labels:
        name: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:5.7
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: SUPERSECRET
