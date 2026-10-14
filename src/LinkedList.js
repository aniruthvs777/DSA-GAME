export class ArtifactNode {
  constructor(id, name, icon) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.next = null;
  }
}
// A real singly linked list; inventory rendering traverses these nodes.
export class LinkedList {
  constructor() { this.head = null; this.length = 0; }
  insert(id, name, icon = "✦") {
    if (this.search(id)) return false;
    const node = new ArtifactNode(id, name, icon);
    if (!this.head) this.head = node;
    else {
      let current = this.head;
      while (current.next) current = current.next;
      current.next = node;
    }
    this.length++;
    return true;
  }
  search(id) {
    let current = this.head;
    while (current) { if (current.id === id) return current; current = current.next; }
    return null;
  }
  remove(id) {
    if (!this.head) return false;
    if (this.head.id === id) { this.head = this.head.next; this.length--; return true; }
    let current = this.head;
    while (current.next && current.next.id !== id) current = current.next;
    if (!current.next) return false;
    current.next = current.next.next;
    this.length--;
    return true;
  }
  toArray() {
    const items = []; let current = this.head;
    while (current) { items.push({ id: current.id, name: current.name, icon: current.icon }); current = current.next; }
    return items;
  }
  clear() { this.head = null; this.length = 0; }
}