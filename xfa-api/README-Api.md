### Executar local
```shell script
  ./mvnw quarkus:dev -DskipTests=true
```

### Executar em container
```bash
  podman stop xfinder-api
```
```bash
  podman rm xfinder-api
```
```shell script
  ./mvnw package -DskipTests=true
```
```bash
  podman build -f src/main/docker/Dockerfile.jvm -t xfinder-api:latest .
```    
```bash
  podman run -d --name xfinder-api --network nt-xfinder -p 8081:8081 xfinder-api:latest
```
```bash
  podman start xfinder-api
```

**Cadastrar Produtos**
```bash
    jq -c '.[]' product.json | while read produto; do 
      nome=$(echo "$produto" | jq -r '.name')
      echo "Enviando produto: $nome..."
      curl -s -X POST "http://localhost:8081/api/products" \
        -H "Content-Type: application/json" \
        -d "$produto"
      echo -e "\n---"
    done
```




> **_NOTE:_**  Quarkus now ships with a Dev UI, which is available in dev mode only at <http://localhost:8080/q/dev/>.

## Packaging and running the application

The application can be packaged using:

```shell script
./mvnw clean package -DskipTests=true
```

It produces the `quarkus-run.jar` file in the `target/quarkus-app/` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/quarkus-app/lib/` directory.

The application is now runnable using `java -jar target/quarkus-app/quarkus-run.jar`.

If you want to build an _über-jar_, execute the following command:

```shell script
./mvnw package -Dquarkus.package.jar.type=uber-jar
```

The application, packaged as an _über-jar_, is now runnable using `java -jar target/*-runner.jar`.

## Creating a native executable

You can create a native executable using:

```shell script
./mvnw package -Dnative
```

Or, if you don't have GraalVM installed, you can run the native executable build in a container using:

```shell script
./mvnw package -Dnative -Dquarkus.native.container-build=true
```

You can then execute your native executable with: `./target/products-api-1.0.0-SNAPSHOT-runner`

If you want to learn more about building native executables, please consult <https://quarkus.io/guides/maven-tooling>.

## Provided Code

### REST

Easily start your REST Web Services

[Related guide section...](https://quarkus.io/guides/getting-started-reactive#reactive-jax-rs-resources)
