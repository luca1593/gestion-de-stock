pipeline {
    agent {
        docker {
            image 'node:18-bullseye'
            args '-v /home/jenkins/.npm:/root/.npm'
        }
    }
    
    environment {
        NG_CLI_ANALYTICS = 'false'
        NODE_VERSION = '18'
        NPM_CONFIG_CACHE = '/root/.npm'
        BUILD_DIR = 'dist/gestion-de-stock'
    }
    
    options {
        timeout(time: 45, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // timestamps() - À mettre dans un bloc 'timestamps' au niveau des étapes
        // ansiColor('xterm') - À utiliser comme wrapper dans les étapes
    }
    
    parameters {
        choice(name: 'ENVIRONMENT', 
               choices: ['dev', 'staging', 'prod'], 
               description: 'Environnement cible')
        booleanParam(name: 'RUN_TESTS', 
                    defaultValue: true, 
                    description: 'Exécuter les tests')
        booleanParam(name: 'RUN_LINT', 
                    defaultValue: true, 
                    description: 'Exécuter le linting')
        booleanParam(name: 'DEPLOY', 
                    defaultValue: false, 
                    description: 'Déployer après le build')
        choice(name: 'DEPLOY_METHOD', 
               choices: ['rsync', 's3', 'docker', 'tomcat'], 
               description: 'Méthode de déploiement')
    }
    
    stages {
        stage('Checkout') {
            steps {
                timestamps {  // Ajouter timestamps ici
                    echo "📦 Récupération du code pour ${params.ENVIRONMENT}..."
                }
                checkout scm
                
                script {
                    env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', 
                                              returnStdout: true).trim()
                    env.BUILD_TIMESTAMP = sh(script: 'date +%Y%m%d-%H%M%S', 
                                            returnStdout: true).trim()
                }
            }
        }
        
        stage('Setup') {
            steps {
                timestamps {
                    echo "🔧 Configuration Node.js ${NODE_VERSION}..."
                    sh '''
                        echo "Node version: $(node --version)"
                        echo "NPM version: $(npm --version)"
                        echo "NPM cache: $(npm config get cache)"
                        
                        # Configurer npm pour les builds CI
                        npm config set fund false
                        npm config set audit false
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                timestamps {
                    echo '📦 Installation des dépendances...'
                    sh '''
                        # Nettoyer le cache si nécessaire
                        if [ -f "package-lock.json" ]; then
                            echo "Using package-lock.json for deterministic install"
                            npm ci --legacy-peer-deps --prefer-offline --no-audit
                        else
                            echo "No package-lock.json found, running npm install"
                            npm install --legacy-peer-deps --no-audit
                        fi
                    '''
                }
            }
        }
        
        stage('Lint') {
            when {
                expression { params.RUN_LINT }
            }
            steps {
                timestamps {
                    echo '🔍 Exécution du linting...'
                    sh '''
                        if npm run lint -- --format=checkstyle > lint-results.xml 2>&1; then
                            echo "✅ Linting passed"
                        else
                            echo "⚠️ Linting found issues (continuing build)"
                            cat lint-results.xml
                        fi
                    '''
                }
            }
            post {
                always {
                    recordIssues enabledForFailure: true,
                        aggregatingResults: true,
                        tools: [checkStyle(pattern: 'lint-results.xml')]
                }
            }
        }
        
        stage('Tests Unitaires') {
            when {
                expression { params.RUN_TESTS }
            }
            steps {
                timestamps {
                    echo '🧪 Exécution des tests unitaires...'
                    sh '''
                        # Exécuter les tests avec Karma
                        npm test -- --watch=false \
                                    --browsers=ChromeHeadless \
                                    --code-coverage \
                                    --reporters=progress,junit
                        
                        # Générer le rapport de couverture
                        if [ -d "coverage" ]; then
                            echo "Coverage report generated"
                        fi
                    '''
                }
            }
            post {
                always {
                    junit '**/test-results/**/*.xml'
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build Application') {
            steps {
                timestamps {
                    echo "🏗️ Build pour ${params.ENVIRONMENT}..."
                    script {
                        def buildCmd = 'npm run build'
                        if (params.ENVIRONMENT == 'prod') {
                            buildCmd = 'npm run build:prod'
                        } else if (params.ENVIRONMENT == 'staging') {
                            buildCmd = 'npm run build:staging'
                        }
                        
                        sh """
                            ${buildCmd}
                            echo "✅ Build completed"
                            echo "Build directory: ${BUILD_DIR}"
                            ls -la ${BUILD_DIR} || echo "⚠️ Build directory not found"
                        """
                    }
                }
            }
        }
        
        stage('Archive Build') {
            steps {
                timestamps {
                    echo '📚 Archivage des artefacts...'
                    script {
                        archiveArtifacts artifacts: "${BUILD_DIR}/**", 
                                           fingerprint: true, 
                                           allowEmptyArchive: false
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                expression { params.DEPLOY }
            }
            steps {
                timestamps {
                    echo "🚀 Déploiement vers ${params.ENVIRONMENT}..."
                    script {
                        def deployMethod = params.DEPLOY_METHOD
                        
                        switch(deployMethod) {
                            case 'rsync':
                                deployWithRsync()
                                break
                            case 's3':
                                deployToS3()
                                break
                            case 'docker':
                                deployWithDocker()
                                break
                            case 'tomcat':
                                deployToTomcat()
                                break
                            default:
                                error "Méthode de déploiement inconnue: ${deployMethod}"
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Nettoyage de l\'espace de travail...'
            cleanWs deleteDirs: true, notFailBuild: true
        }
        
        success {
            echo '🎉 Pipeline exécuté avec succès!'
            emailext (
                subject: "✅ SUCCESS: Build #${env.BUILD_NUMBER} - Gestion de Stock",
                body: """
                    Build terminé avec succès!
                    
                    📊 Détails:
                    - Build: #${env.BUILD_NUMBER}
                    - Environnement: ${params.ENVIRONMENT}
                    - Branche: ${env.GIT_BRANCH}
                    - Commit: ${env.GIT_COMMIT_SHORT}
                    
                    🔗 Consulter: ${env.BUILD_URL}
                """,
                to: 'luca.adam23@gmail.com'
            )
        }
        
        failure {
            echo '❌ Échec du pipeline!'
            emailext (
                subject: "❌ FAILURE: Build #${env.BUILD_NUMBER} - Gestion de Stock",
                body: """
                    Le build a échoué!
                    
                    📊 Détails:
                    - Build: #${env.BUILD_NUMBER}
                    - Environnement: ${params.ENVIRONMENT}
                    - Branche: ${env.GIT_BRANCH}
                    - Commit: ${env.GIT_COMMIT_SHORT}
                    
                    🔍 Vérifier les logs: ${env.BUILD_URL}
                """,
                to: 'luca.adam23@gmail.com'
            )
        }
    }
}

// Fonctions de déploiement
def deployWithRsync() {
    sh """
        echo "Déploiement par rsync vers ${params.ENVIRONMENT}..."
        rsync -avz --delete ${BUILD_DIR}/ user@server:/var/www/gestion-de-stock/
    """
}

def deployToS3() {
    sh """
        echo "Déploiement vers S3..."
        aws s3 sync ${BUILD_DIR}/ s3://bucket-gestion-stock/${params.ENVIRONMENT}/ --delete
    """
}

def deployWithDocker() {
    sh """
        echo "Build et déploiement Docker..."
        docker build -t gestion-stock:${env.BUILD_TIMESTAMP} .
        docker tag gestion-stock:${env.BUILD_TIMESTAMP} gestion-stock:latest
    """
}

def deployToTomcat() {
    sh """
        echo "Déploiement vers Tomcat..."
        # Créer le WAR
        cd ${BUILD_DIR}
        jar -cvf ../gestion-stock.war *
        cd ..
        
        # Déployer
        curl -u admin:password \
            -X PUT \
            --upload-file gestion-stock.war \
            "http://tomcat-server:8080/manager/text/deploy?path=/gestion-stock&update=true"
    """
}