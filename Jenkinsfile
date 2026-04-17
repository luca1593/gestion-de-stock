pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checkout...'
                checkout scm
            }
        }
        
        stage('Clean') {
            steps {
                echo '🧹 Cleaning old containers...'
                sh '''
                    docker compose -f docker-compose.yml down --remove-orphans || true
                    docker stop gs-frontend || true
                    docker rm gs-frontend || true
                '''
            }
        }
        
        stage('Build and Deploy') {
            steps {
                echo '🏗️ Building and deploying...'
                sh '''
                    # Build et démarrage
                    docker compose -f docker-compose.yml up -d --build
                    
                    # Attendre que le conteneur soit prêt
                    sleep 10
                    
                    # Vérifier le statut
                    docker compose -f docker-compose.yml ps
                    
                    # Afficher les logs
                    docker compose -f docker-compose.yml logs --tail=30
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🔍 Health check...'
                sh '''
                    # Vérifier que le conteneur tourne
                    if docker ps | grep -q gs-frontend; then
                        echo "✅ Container is running"
                    else
                        echo "❌ Container is not running"
                        docker logs gs-frontend
                        exit 1
                    fi
                    
                    # Tester l'application
                    for i in 1 2 3 4 5; do
                        if curl -f http://localhost:8086 > /dev/null 2>&1; then
                            echo "✅ Application is accessible"
                            exit 0
                        fi
                        echo "Attempt $i/5 - Waiting..."
                        sleep 5
                    done
                    
                    echo "❌ Application not accessible"
                    docker logs gs-frontend
                    exit 1
                '''
            }
        }
    }
    
    post {
        success {
            echo '🎉 Deployment successful!'
            echo "🌐 Application: http://12.24.5.100:8086"
        }
        failure {
            echo '❌ Deployment failed!'
            sh 'docker logs gs-frontend || true'
        }
    }
}