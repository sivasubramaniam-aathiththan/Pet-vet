@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET "BASE_DIR=%~dp0") ELSE (SET "BASE_DIR=%__MVNW_ARG0_NAME__%")

@SET MAVEN_PROJECTBASEDIR=%BASE_DIR%
@IF NOT "%MAVEN_BASEDIR%"=="" SET MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%

@IF NOT EXIST "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar" (
  @IF NOT EXIST "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties" (
    @ECHO Could not find .mvn\wrapper\maven-wrapper.jar or .mvn\wrapper\maven-wrapper.properties
    @EXIT /B 1
  )
)

@SET MVNW_VERBOSE=false
@IF "%MVNW_VERBOSE%"=="true" (
  @SET MAVEN_CMD_LINE_ARGS=--no-transfer-progress %*
) ELSE (
  @SET MAVEN_CMD_LINE_ARGS=%*
)

@SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@SET WRAPPER_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.1/maven-wrapper-3.3.1.jar"
@SET DOWNLOAD_URL=%WRAPPER_URL%

FOR /F "usebackq tokens=1,2 delims==" %%A IN ("%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties") DO (
    IF "%%A"=="wrapperUrl" SET DOWNLOAD_URL=%%B
)

@SET M2_HOME=%USERPROFILE%\.m2
@SET MAVEN_OPTS=%MAVEN_OPTS%

@SET JAVA_HOME_TO_USE=%JAVA_HOME%

@IF EXIST "%JAVA_HOME_TO_USE%\jre\bin\java.exe" (
  @SET JAVA_EXE=%JAVA_HOME_TO_USE%\jre\bin\java.exe
) ELSE IF EXIST "%JAVA_HOME_TO_USE%\bin\java.exe" (
  @SET JAVA_EXE=%JAVA_HOME_TO_USE%\bin\java.exe
) ELSE (
  @SET JAVA_EXE=java.exe
)

@SET CLASSWORLDS_CONF=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties

"%JAVA_EXE%" ^
  %MAVEN_OPTS% ^
  "--add-opens=java.base/java.lang=ALL-UNNAMED" ^
  "--add-opens=java.base/java.io=ALL-UNNAMED" ^
  "--add-opens=java.base/java.util=ALL-UNNAMED" ^
  "--add-opens=java.base/java.net=ALL-UNNAMED" ^
  "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%." ^
  -classpath %WRAPPER_JAR% ^
  %WRAPPER_LAUNCHER% %MAVEN_CMD_LINE_ARGS%
