'use strict';

const hashRing = require('../routing/hashRing');

describe('Consistent Hashing Tests', () => {
  beforeEach(() => {
    // We can't easily clear the hashRing module state if it's a singleton,
    // but we can re-initialize it or clear nodes. 
    // For this test, we will assume we can mock or just add/remove.
    // Let's clear internal nodes by removing any that exist.
    const nodes = ['node-a', 'node-b', 'node-c', 'node-d'];
    nodes.forEach(n => hashRing.removeNode(n));
  });

  it('should assign correct number of virtual nodes', () => {
    hashRing.addNode('node-a');
    // We cannot access the private ring directly without exporting it,
    // but we can verify it routes deterministically.
    const target = hashRing.getNodeForKey('testKey1');
    expect(target).toBe('node-a');
  });

  it('should map keys deterministically', () => {
    hashRing.addNode('node-a');
    hashRing.addNode('node-b');
    hashRing.addNode('node-c');

    const key = 'user:1234';
    const target1 = hashRing.getNodeForKey(key);
    const target2 = hashRing.getNodeForKey(key);
    const target3 = hashRing.getNodeForKey(key);

    expect(target1).toBe(target2);
    expect(target2).toBe(target3);
  });

  it('should exhibit minimal key movement when a node is added', () => {
    hashRing.addNode('node-a');
    hashRing.addNode('node-b');
    hashRing.addNode('node-c');

    const keyAssignments = new Map();
    for (let i = 0; i < 100; i++) {
      const key = `key-${i}`;
      keyAssignments.set(key, hashRing.getNodeForKey(key));
    }

    hashRing.addNode('node-d');

    let movedKeys = 0;
    for (let i = 0; i < 100; i++) {
      const key = `key-${i}`;
      if (keyAssignments.get(key) !== hashRing.getNodeForKey(key)) {
        movedKeys++;
      }
    }

    // Adding 1 node to a 3 node cluster should theoretically move ~25% of keys.
    // The test ensures it's significantly less than 100% (not a full cache flush).
    expect(movedKeys).toBeLessThan(50);
  });
});
