hoblang build-exe main.hob .build/bundle.wasm \
    --target wasm32 \
    --mode32 \
    --linker /usr/bin/wasm-ld \
        --link-arg --export-all \
        --link-arg --no-entry \
        --link-arg --import-memory \
        --link-arg --import-table \
        --link-arg --import-undefined
python3 -m http.server
