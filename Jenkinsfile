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
                sh 'yarn build:prod'
                stash includes: 'dist/', name: 'dist'
            }
        }
    }
}
