pipeline {
    agent any

    environment {
        BACKEND_IMAGE = 'three-tier-cicd-project-backend:latest'
        FRONTEND_IMAGE = 'three-tier-cicd-project-frontend:latest'

        TRIVY = 'C:\\Users\\DELL\\AppData\\Local\\Microsoft\\WinGet\\Packages\\AquaSecurity.Trivy_Microsoft.Winget.Source_8wekyb3d8bbwe\\trivy.exe'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                bat 'docker build -t %BACKEND_IMAGE% ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat 'docker build -t %FRONTEND_IMAGE% ./frontend'
            }
        }

        stage('Trivy Scan Backend') {
            steps {
                bat '"%TRIVY%" image --format json --output trivy-backend-report.json %BACKEND_IMAGE%'
            }
        }

        stage('Trivy Scan Frontend') {
            steps {
                bat '"%TRIVY%" image --format json --output trivy-frontend-report.json %FRONTEND_IMAGE%'
            }
        }

        stage('Archive Trivy Reports') {
            steps {
                archiveArtifacts artifacts: 'trivy-backend-report.json,trivy-frontend-report.json',
                    allowEmptyArchive: false
            }
        }

        stage('Deploy MySQL') {
            steps {
                bat 'kubectl apply -f k8s/mysql-deployment.yaml'
            }
        }

        stage('Deploy Backend') {
            steps {
                bat 'kubectl apply -f k8s/backend-deployment.yaml'
            }
        }

        stage('Deploy Frontend') {
            steps {
                bat 'kubectl apply -f k8s/frontend-deployment.yaml'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'kubectl get pods -n employee-app'
                bat 'kubectl get services -n employee-app'
            }
        }

        stage('Health Check') {
            steps {
                bat 'kubectl rollout status deployment/mysql -n employee-app --timeout=120s'
                bat 'kubectl rollout status deployment/backend -n employee-app --timeout=120s'
                bat 'kubectl rollout status deployment/frontend -n employee-app --timeout=120s'
            }
        }

        stage('Docker Cleanup') {
            steps {
                bat 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'CI/CD pipeline failed.'
        }
    }
}