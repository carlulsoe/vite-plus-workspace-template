FROM node:22-bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV PATH=/root/.vite-plus/bin:${PATH}
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
  && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://vite.plus | bash

# Bake Chromium and its Linux dependencies into the image so `vp run ready`
# can execute Playwright tests without additional container setup.
RUN vp dlx playwright@1.58.2 install --with-deps chromium
