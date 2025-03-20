const log = {
    str(size, ptr) {
        console.log(bindings.loadStr(size, ptr))
    },
    err(size, ptr) {
        console.error(bindings.loadStr(size, ptr))
    },
    integer(value) {
        console.log(value)
    }
};

class ObjectPool {
    constructor() {
        this.pool = new Map();
        this.lastId = 0;
    }

    putObject(obj) {
        this.pool.set(this.lastId, obj);
        return this.lastId++;
    }

    deleteObject(id) {
        this.pool.delete(id);
    }

    get(id) {
        if (!this.pool.has(id)) {
            console.error(this.pool);
            throw Error(`trying to get element with id ${id} which not exist`)
        }
        return this.pool.get(id);
    }
}

const pool = new ObjectPool()

const poolApi = {
    leak(id) {
        pool.deleteObject(id)
    },
};

const dom = {
    createElement(size, ptr) {
        return pool.putObject(
            document.createElement(
                bindings.loadStr(size, ptr)
            )
        );
    },
    queryElement(size, ptr) {
        return pool.putObject(
            document.querySelector(
                bindings.loadStr(size, ptr)
            )
        );
    },
    deleteElement(id) {
        pool.get(id).remove();
        pool.deleteObject(id);
    },
    appendElement(where, what) {
        pool.get(where).append(pool.get(what));
        return where;
    },
    setTextContent(id, size, ptr) {
        pool.get(id).textContent = bindings.loadStr(size, ptr)
        return id;
    },
    addClass(id, nameSize, namePtr) {
        pool.get(id).classList.add(bindings.loadStr(nameSize, namePtr));
        return id;
    },
    setAttr(id, nameSize, namePtr, valSize, valPtr) {
        const name = bindings.loadStr(nameSize, namePtr);
        const value = bindings.loadStr(valSize, valPtr);
        pool.get(id).setAttribute(name, value);
        return id;
    },
    setListener(id, nameSize, namePtr, ptr) {
        pool.get(id)[`on${bindings.loadStr(nameSize, namePtr)}`] = (e) => {
            e.preventDefault();
            runtime.table.get(ptr)(pool.putObject(e.target));
        };
        return id;
    },
    getParent(id) {
        return pool.putObject(pool.get(id).parentElement);
    },
    setTextContentStr(id, strId) {
        pool.get(id).textContent = pool.get(strId);
        return id;
    },
    getValueStr(id) {
        return pool.putObject(pool.get(id).value);
    }
};
