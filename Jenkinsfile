pipeline {
    agent { docker { image 'circleci/node:9.3-stretch-browsers' } }
    stages {
        stage('Fetch dependencies') {
            agent {
                docker 'circleci/node:9.3-stretch-browsers'
            }
            steps {
                sh 'yarn'
                stash includes: 'node_modules/', name: 'node_modules'
            }
       }
        stage('Compile') {
            agent {
                docker 'circleci/node:9.3-stretch-browsers'
            }
            steps {
                unstash 'node_modules'
                sh 'yarn ng build --prod'
                stash includes: 'dist/', name: 'dist'
            }
        }
        stage('Build and Push Docker Image') {
            agent any
            environment {
            DOCKER_PUSH = credentials('dockerhub')
            }
            steps {
            unstash 'dist'
            sh 'docker build -t pjsong/vending-ui_demo -f docker/nginx/Dockerfile .'
            sh 'docker login -u $DOCKER_PUSH_USR -p $DOCKER_PUSH_PSW'
            sh 'docker push $DOCKER_PUSH_URL/vending-ui_demo'
      }
    }
    }
}
