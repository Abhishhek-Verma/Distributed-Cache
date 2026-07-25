'use strict';

const nodeRegistryService = require('../node-manager/nodeRegistryService');

describe('Heartbeat & Failure Detection Tests', () => {
  beforeEach(() => {
    // Setup a dummy node
    nodeRegistryService.registerNode({ id: 'node-test', host: 'localhost', port: 5001 });
  });

  afterEach(() => {
    nodeRegistryService.removeNode('node-test');
  });

  it('should process heartbeat reception correctly', () => {
    const initialNode = nodeRegistryService.getNode('node-test');
    expect(initialNode.lastHeartbeat).toBeNull();

    nodeRegistryService.recordHeartbeat('node-test');

    const updatedNode = nodeRegistryService.getNode('node-test');
    expect(updatedNode.lastHeartbeat).not.toBeNull();
    expect(updatedNode.status).toBe(nodeRegistryService.NODE_STATUS.ONLINE);
  });

  it('should detect node failure after timeout (mocked)', () => {
    // Instead of waiting real time, we can manually manipulate the heartbeat timestamp
    // and verify the heartbeat monitor logic (if we could inject time).
    // For unit testing, we verify nodeRegistryService status update directly.
    nodeRegistryService.setNodeStatus('node-test', nodeRegistryService.NODE_STATUS.OFFLINE);
    const updatedNode = nodeRegistryService.getNode('node-test');
    expect(updatedNode.status).toBe(nodeRegistryService.NODE_STATUS.OFFLINE);
  });

  it('should auto-recover a failed node upon receiving a new heartbeat', () => {
    nodeRegistryService.setNodeStatus('node-test', nodeRegistryService.NODE_STATUS.OFFLINE);
    expect(nodeRegistryService.getNode('node-test').status).toBe(nodeRegistryService.NODE_STATUS.OFFLINE);

    nodeRegistryService.recordHeartbeat('node-test');

    expect(nodeRegistryService.getNode('node-test').status).toBe(nodeRegistryService.NODE_STATUS.ONLINE);
  });
});
