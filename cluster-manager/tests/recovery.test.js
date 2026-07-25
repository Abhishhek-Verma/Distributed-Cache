'use strict';

// Mock dependencies
jest.mock('../node-manager/nodeRegistryService');
jest.mock('../routing/routingService');
jest.mock('../routing/requestForwarder');
jest.mock('axios');

const recoveryService = require('../node-manager/recoveryService');
const nodeRegistryService = require('../node-manager/nodeRegistryService');
const routingService = require('../routing/routingService');
const requestForwarder = require('../routing/requestForwarder');
const axios = require('axios');

describe('Automatic Recovery Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger recovery when a node fails', async () => {
    // Setup mocks
    nodeRegistryService.getActiveNodes.mockReturnValue([
      { id: 'node-b', host: 'localhost', port: 5002 }
    ]);
    
    axios.get.mockResolvedValue({
      status: 200,
      data: {
        success: true,
        data: [{ key: 'k1', value: 'v1', ttl: 300 }]
      }
    });

    routingService.findNodesForKey.mockReturnValue({
      success: true,
      primaryNode: { id: 'node-b' },
      replicaNode: { id: 'node-c' } // Re-assigned due to failure
    });

    await recoveryService.recoverNode('node-a');

    // Verify it exported keys from the active node
    expect(axios.get).toHaveBeenCalledWith('http://localhost:5002/api/v1/cache/_export', expect.any(Object));

    // Verify it forwarded the key to the new replica (node-c) since node-b already has it
    expect(requestForwarder.forwardToNode).toHaveBeenCalledWith(
      { id: 'node-c' },
      'POST',
      '/api/v1/cache',
      { key: 'k1', value: 'v1', ttl: 300 },
      { 'x-is-replica': 'true' }
    );
  });
});
