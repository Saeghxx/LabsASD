class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
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

        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = newNode;
    }

    print() {
        let current = this.head;
        let result = "";

        while (current) {
            result += current.data;
            current = current.next;
        }

        console.log(result);
    }

    clear() {
        this.head = null;
    }

    rearrange() {
        const vowels = new LinkedList();
        const consonants = new LinkedList();

        const vowelSet = new Set(['a','e','i','o','u','y']);

        let current = this.head;

        while (current) {
            if (vowelSet.has(current.data.toLowerCase())) {
                vowels.append(current.data);
            } else {
                consonants.append(current.data);
            }
            current = current.next;
        }

        if (!vowels.head) {
            this.head = consonants.head;
            return;
        }

        let temp = vowels.head;
        while (temp.next) {
            temp = temp.next;
        }

        temp.next = consonants.head;
        this.head = vowels.head;
    }
}

const inputs = ["university", "computer", "algorithm", "education", "javascript"];

for (let input of inputs) {
    const list = new LinkedList();

    for (let char of input) {
        list.append(char);
    }

    console.log("Початковий список:");
    list.print();

    list.rearrange();

    console.log("Результат:");
    list.print();
}