#stage 1
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

COPY pom.xml ./
RUN mvn dependency:go-offline -B
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: 
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
