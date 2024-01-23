# Use an image that has conda and python installed
FROM continuumio/miniconda3

# Set the working directory
WORKDIR /app

# Create a new conda environment with Python 3.10
RUN conda create --name whisperx python=3.10
RUN echo "source activate whisperx" > ~/.bashrc
ENV PATH /opt/conda/envs/whisperx/bin:$PATH

# Activate the environment and install PyTorch and dependencies
RUN /bin/bash -c "source activate whisperx && \
    conda install --yes pytorch==2.0.0 torchaudio==2.0.0 pytorch-cuda=11.8 -c pytorch -c nvidia"

# Install WhisperX from the GitHub repository
RUN pip install git+https://github.com/m-bain/whisperx.git

# Install additional dependencies (ffmpeg, rust, etc.)
# Note: These commands are placeholders and should be replaced with actual installation commands as needed.
RUN apt-get update && apt-get install -y ffmpeg
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

# Set the default command to run WhisperX
# Note: This command is a placeholder. Replace 'sample01.wav' with the actual file you want to process,
# or modify the Dockerfile to accept the filename as an argument.
CMD ["whisperx", "examples/sample01.wav"]
