set -e

mkdir -p .build

hoblang build-exe src/main.hob .build/bundle.wasm \
    --mode32 \
    --target wasm32 \
    --linker /usr/bin/wasm-ld \
    --link-arg --export-if-defined=main \
    --link-arg --import-undefined \
    --link-arg --import-memory \
    --link-arg --import-table \
    --link-arg --no-entry
