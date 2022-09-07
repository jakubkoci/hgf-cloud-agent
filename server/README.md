Docker build

```
docker build -t hgf-cloud-agent .
```

Docker run

```
 docker run -v `pwd`:/www -v /www/node_modules -it -p 3001:3001 --name hgf-cloud-agent hgf-cloud-agent
```
