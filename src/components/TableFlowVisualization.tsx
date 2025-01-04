"use client";

import React, { useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { TableNode } from "@/components/TableNode";
import { Button } from "@/components/ui/button";
import { DatabaseZap, BadgeMinusIcon } from "lucide-react";

const nodeTypes = {
  tableNode: TableNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "tableNode",
    position: { x: 0, y: 0 },
    data: {
      tableAlias: "Users",
      dataset: "myapp",
      schema: "public",
      tableName: "users",
      createStatement:
        "CREATE TABLE Users (\n  id INT PRIMARY KEY,\n  name VARCHAR(255),\n  email VARCHAR(255)\n);",
      query: "SELECT * FROM Users;",
    },
  },
  {
    id: "2",
    type: "tableNode",
    position: { x: 1000, y: 0 },
    data: {
      tableAlias: "Orders",
      dataset: "myapp",
      schema: "public",
      tableName: "orders",
      createStatement:
        "CREATE TABLE Orders (\n  id INT PRIMARY KEY,\n  user_id INT,\n  total DECIMAL(10, 2),\n  FOREIGN KEY (user_id) REFERENCES Users(id)\n);",
      query: "SELECT o.* FROM Orders o\nJOIN Users u ON o.user_id = u.id;",
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    markerEnd: {
      type: MarkerType.Arrow,
    },
  },
];

export function TableFlowVisualization() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: "tableNode",
      position: { x: Math.random() * 800, y: Math.random() * 600 },
      data: {
        tableAlias: "New Table",
        dataset: "myapp",
        schema: "public",
        tableName: "new_table",
        createStatement: "CREATE TABLE NewTable (\n  id INT PRIMARY KEY\n);",
        query: "SELECT * FROM NewTable;",
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes]);

  const deleteNode = useCallback(() => {
    setNodes((nds) => {
      // Find the selected node
      const selectedNode = nds.find((node) => node.selected);

      if (!selectedNode) {
        console.warn("No node is selected to delete.");
        return nds; // Return the current nodes if no node is selected
      }

      // Remove the selected node
      return nds.filter((node) => node.id !== selectedNode.id);
    });

    setEdges((eds) => {
      // Remove edges connected to the selected node
      const selectedNode = nodes.find((node) => node.selected);
      if (!selectedNode) return eds; // Return the current edges if no node is selected

      return eds.filter(
        (edge) =>
          edge.source !== selectedNode.id && edge.target !== selectedNode.id
      );
    });
  }, [nodes, setNodes, setEdges]);

  return (
    <div className="w-full h-[800] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <div className="absolute top-4 left-4 z-10 flex gap-4">
        <Button onClick={addNode} className="flex items-center gap-2 p-3">
          <DatabaseZap className="w-4 h-4" />
          New Table
        </Button>
        <Button onClick={deleteNode} className="flex items-center gap-2 p-3">
          <BadgeMinusIcon className="w-4 h-4" />
          Delete Node
        </Button>
      </div>
    </div>
  );
}
