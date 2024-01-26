PROJECT_ID='vacotechsprint'

gcloud config set project $PROJECT_ID

# First attempt to build Whisper directly
gcloud artifacts repositories create vacotechsprint --repository-format=docker \
    --location=us-east4 --description="VACOTechSprint Docker Repo"

gcloud artifacts repositories list

##  Not sure the difference between the west2 and gcr.io domains, but excluding the region puts it in a 'global' bucket in console
gcloud builds submit --region=us-west2 --tag us-west2-docker.pkg.dev/$PROJECT_ID/vacotechsprint/whisperx:tag1
gcloud builds submit --tag gcr.io/$PROJECT_ID/whisperx:tag1

# Using the DennisTheD/whisper-asr-webservice
```cloudbuild.yml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/vacotechsprint/whisperx-asr-webservice', '-f', 'Dockerfile.gpu', '.']
images:
  - 'gcr.io/vacotechsprint/whisperx-asr-webservice'

```

gcloud builds submit --config cloudbuild.yaml

# This seems to force the disk image to docker optimized
gcloud compute instances create-with-container whisperx-asr-webservice \
    --container-image gcr.io/vacotechsprint/whisperx-asr-webservice:latest \
    --zone us-east4-a \
    --machine-type n1-standard-4 \
    --accelerator=type=nvidia-tesla-t4,count=1 \
    --maintenance-policy=TERMINATE \
    --provisioning-model=SPOT \
    --boot-disk-size 30GB \
    --metadata install-nvidia-driver=True \
    --tags http-server,https-server

# using gui
gcloud compute instances create whisperx-asr \
    --project=vacotechsprint \
    --zone=us-east4-a \
    --machine-type=n1-standard-1 \
    --network-interface=network-tier=PREMIUM,stack-type=IPV4_ONLY,subnet=default \
    --no-restart-on-failure \
    --maintenance-policy=TERMINATE \
    --provisioning-model=SPOT \
    --instance-termination-action=STOP \
    --service-account=836049505470-compute@developer.gserviceaccount.com \
    --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append \
    --accelerator=count=1,type=nvidia-tesla-t4 \
    --tags=whisper-asr \
    --create-disk=auto-delete=yes,boot=yes,device-name=instance-1,image=projects/ml-images/global/images/c0-deeplearning-common-gpu-v20240111-debian-11-py310,mode=rw,size=100,type=projects/vacotechsprint/zones/us-east4-a/diskTypes/pd-balanced \
    --no-shielded-secure-boot \
    --shielded-vtpm \
    --shielded-integrity-monitoring \
    --labels=goog-ops-agent-policy=v2-x86-template-1-1-0,goog-ec-src=vm_add-gcloud \
    --reservation-affinity=any

# public firewall rule for ASR
gcloud compute --project=vacotechsprint firewall-rules create whisper-asr --description="port 9000 ingress" --direction=INGRESS --priority=1000 --network=default --action=ALLOW --rules=tcp:9000,udp:9000 --source-ranges=0.0.0.0/0 --target-tags=whisper-asr


# install Ops agent
# not needed when including --labels=goog-ops-agent-policy=v2-x86-template-1-1-0
sudo apt-get update --allow-releaseinfo-change
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

docker pull gcr.io/vacotechsprint/whisperx-asr-webservice

docker run -d -p 9000:9000 -e ASR_MODEL=base -e ASR_ENGINE=openai_whisper gcr.io/vacotechsprint/whisperx-asr-webservice