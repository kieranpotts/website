#
# Dockerfile
#
# Provides a containerized development environment for the website. The image is
# based on the official Node.js slim variant of Debian bookworm, which keeps the
# image small while providing a stable Linux base. The Node version matches
# .nvmrc.
#
# Usage:
#   docker compose build
#
# Use the scripts in ./run/ to execute project tasks inside the container.
#

FROM node:22.13.0-bookworm-slim

# git: required by Antora to read the local content source.
# procps: provides `ps`, which concurrently/start-server-and-test use to
#   tree-kill sibling processes on shutdown. Without it, teardown crashes with
#   `spawn ps ENOENT` (seen on preview Ctrl+C and during linkcheck).
RUN apt-get update \
    && apt-get install -y --no-install-recommends git procps \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# chokidar-cli runs the rebuild command (its `-c` argument) through a shell,
# reading $SHELL to locate one. The slim base image leaves $SHELL unset, which
# crashes the watcher on the first file change. Point it at the shell present
# in this image.
ENV SHELL=/bin/sh

WORKDIR /workspace
