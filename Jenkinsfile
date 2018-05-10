pipeline {
    agent { docker { image 'node:8.11.1' } }
    stages {
        stage('install') {
            steps {
                sh 'npm --version'
                checkout scm
                sh 'yarn'
                sh 'npm i -g @angular/cli'
                stash includes: 'node_modules/', name: 'node_modules'

            }
        }
        stage('build-dist') {
            steps {
                sh 'ng build --prod'
                stash includes: 'dist/', name: 'dist'
            }
        }        
        stage('build-docker') {
            environment {
              DOCKER_PUSH = credentials('dockerhub')
          }
            steps {
                unstash 'dist'
                sh 'docker build -t pjsong/vending-ui_demo -f docker/nginx/Dockerfile .'
                sh 'docker login -u $DOCKER_PUSH_USR -p $DOCKER_PUSH_PSW'
                sh 'docker push pjsong/vending-ui_demo'
            }
        }              
    }
}

