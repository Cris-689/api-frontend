pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  # Se omite runAsNonRoot en Kaniko por defecto ya que requiere acceso root dentro del contenedor para construir el filesystem de la imagen.
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command: ["/busybox/cat"]
    tty: true
    volumeMounts:
      - name: kaniko-secret
        mountPath: /kaniko/.docker
      - name: kaniko-cache
        mountPath: /cache
  - name: helm
    image: alpine/helm:3.14.0 # Fijar versión de Helm para reproducibilidad
    command: ["/bin/sh", "-c"]
    args: ["tail -f /dev/null"]
  volumes:
    - name: kaniko-secret
      emptyDir: {}
    - name: kaniko-cache
      persistentVolumeClaim:
        claimName: kaniko-cache-pvc
'''
        }
    }

    environment {
        IMAGE_NAME = "uzbuzbiz/next-frontend"
        HELM_RELEASE_NAME = "frontend-release"
        NAMESPACE = "frontend-prod"
        NEXT_TELEMETRY_DISABLED = "1"
    }
    //a
    stages {
        stage('Build & Push with Kaniko') {
            steps {
                container('kaniko') {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', 
                                                    usernameVariable: 'DOCKER_USER', 
                                                    passwordVariable: 'DOCKER_PASS')]) {
                        script {
                            sh """
                            echo "{\\\"auths\\\":{\\\"https://index.docker.io/v1/\\\":{\\\"auth\\\":\\\"\$(echo -n \${DOCKER_USER}:\${DOCKER_PASS} | base64)\\\"}}}" > /kaniko/.docker/config.json

                            /kaniko/executor --context "${WORKSPACE}" \
                                --dockerfile "${WORKSPACE}/Dockerfile" \
                                --destination ${IMAGE_NAME}:${env.BUILD_ID} \
                                --destination ${IMAGE_NAME}:latest \
                                --cache=true \
                                --cache-dir=/cache \
                                --snapshot-mode=redo \
                                --use-new-run
                            """
                        }
                    }
                }
            }
        }

        stage('Deploy with Helm') {
            steps {
                container('helm') {
                    script {
                        // Despliegue atómico con Helm. --wait asegura que los pods estén Ready antes de marcar el pipeline como exitoso.
                        sh """
                        helm upgrade --install ${HELM_RELEASE_NAME} ./helm \
                            --namespace ${env.NAMESPACE} \
                            --create-namespace \
                            --set image.tag=${env.BUILD_ID} \
                            --atomic \
                            --timeout 5m \
                            --wait
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Despliegue exitoso en uzbuzbiz.es (Namespace: ${env.NAMESPACE})"
        }
        failure {
            echo "El pipeline ha fallado. Revisar el clúster o los logs del Pod de Jenkins."
        }
    }
}