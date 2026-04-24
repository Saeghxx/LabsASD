class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
        console.log(`Node created: ${data}`);
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    append(data) {
        const newNode = new Node(data);

        if (!this.head) {
            this.head = newNode;
            return;
        }

        let temp = this.head;
        while (temp.next) {
            temp = temp.next;
        }
        temp.next = newNode;
    }

    print() {
        let temp = this.head;
        let result = "";

        while (temp) {
            result += temp.data;
            temp = temp.next;
        }

        console.log("List:", result);
    }

    rearrange() {
        const vowels = "aeiouy";

        let vowelHead = null, vowelTail = null;
        let consHead = null, consTail = null;

        let current = this.head;

        while (current) {
            let nextNode = current.next;
            current.next = null;

            if (vowels.includes(current.data.toLowerCase())) {
                if (!vowelHead) {
                    vowelHead = vowelTail = current;
                } else {
                    vowelTail.next = current;
                    vowelTail = current;
                }
            } else {
                if (!consHead) {
                    consHead = consTail = current;
                } else {
                    consTail.next = current;
                    consTail = current;
                }
            }

            current = nextNode;
        }

        if (vowelTail) {
            vowelTail.next = consHead;
            this.head = vowelHead;
        } else {
            this.head = consHead;
        }

        console.log("List rearranged");
    }

    destroy() {
        let current = this.head;

        while (current) {
            console.log(`Node deleted: ${current.data}`);
            let temp = current;
            current = current.next;
            temp.next = null;
        }

        this.head = null;
    }
}

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter a word: ", function(input) {

    const list = new LinkedList();

    for (let ch of input) {
        list.append(ch);
    }

    console.log("\nInitial list:");
    list.print();

    list.rearrange();

    console.log("After processing:");
    list.print();

    console.log("\nDestroying list:");
    list.destroy();

    rl.close();
});