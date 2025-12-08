#stage 1
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

COPY pom.xml ./
#install dependencies and plugins in offline mode and instead of offline we can use resolve but it downloads only dependencies not plugins.-B means dont ask for Yes while downloading anything
RUN mvn dependency:go-offline -B
COPY . .
#-DskipTests means skip test cases
RUN mvn clean package -DskipTests

# Stage 2: 
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
