#gcloud compute instances create-with-container whisperx \
#    --container-image gcr.io/vacotechsprint/whisperx_container \
#    --zone us-east4-c \
#    --machine-type n1-standard-1 \
#    --provisioning-model=SPOT \

PROJECT_ID='vacotechsprint'

gcloud config set project $PROJECT_ID

gcloud artifacts repositories create vacotechsprint --repository-format=docker \
    --location=us-east4 --description="VACOTechSprint Docker Repo"

gcloud artifacts repositories list

# Not sure the difference between the west2 and gcr.io domains, but excluding the region puts it in a 'global' bucket in console
gcloud builds submit --region=us-west2 --tag us-west2-docker.pkg.dev/$PROJECT_ID/vacotechsprint/whisperx:tag1

gcloud builds submit --tag gcr.io/$PROJECT_ID/whisperx:tag1


gcloud builds submit --tag gcr.io/vacotechsprint/whisperx_container
