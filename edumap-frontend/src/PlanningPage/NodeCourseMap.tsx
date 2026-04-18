import '@xyflow/react/dist/style.css'
import  {Background, 
        BackgroundVariant, 
        Controls, 
        ReactFlow, 
        ReactFlowProvider} from '@xyflow/react'
import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { supabase } from '../Authentication/supabaseClient';
import { handleSignIn, handleSignUp } from '../Authentication/AuthLogic';
import '../index.css'

import { useOnDropCourse, useOnHandleNodeDragStop, useOnNodesDelete } from './ReactFlowNodeLogic';
import { useAutosave } from '../Hooks/useSaveMap.tsx';

function NodeCourseMap({
    setSelectedNode, 
    allNodes, 
    setNodes, 
    onChangeNodes, 
    nodeTypes, 
    userId,
    allEdges,
    onChangeEdges,
    onConnect}: any){

    const onNodesDelete = useOnNodesDelete(setNodes);
    const onDropCourse = useOnDropCourse(setNodes);
    const handleNodeDragStop = useOnHandleNodeDragStop(setNodes);

    const { saveStatus, isSaving } = useAutosave(userId, allNodes, allEdges);

    const [menuOpen, setMenuOpen] = useState(false);

    const [authOpen, setAuthOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const logOutUser = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    const submitAuth = async () => {
        setAuthLoading(true);
        setAuthError("");

        try {
            if (isLogin) {
                await handleSignIn(email, password);
            } else {
                await handleSignUp(email, password);
            }

            setAuthOpen(false);
            window.location.reload();
        } catch (err: any) {
            setAuthError(err.message || "Auth failed");
        } finally {
            setAuthLoading(false);
        }
    };

    return (
        <div className={`h-full`}>

            <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200 text-xs text-gray-500 font-medium">

                {isSaving && <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />}
                <span>{userId ? saveStatus : "Not saved"}</span>

                <div className="relative ml-2" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen(prev => !prev)}
                        className="px-2 py-1 bg-gray-100 rounded-md"
                    >
                        ☰
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-md text-sm">

                            {userId ? (
                                <button
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                    onClick={logOutUser}
                                >
                                    Log out
                                </button>
                            ) : (
                                <button
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                    onClick={() => {
                                        setAuthOpen(true);
                                        setMenuOpen(false);
                                    }}
                                >
                                    Log in / Sign up
                                </button>
                            )}

                        </div>
                    )}
                </div>
            </div>

            {authOpen && (
                <div className="absolute top-16 right-4 z-[100] w-72 bg-white border rounded-xl shadow-lg p-4 flex flex-col gap-2">

                    {authError && (
                        <p className="text-red-500 text-xs text-center">{authError}</p>
                    )}

                    <div className="absolute -top-1 right-2">
                        <button
                            onClick={() => setAuthOpen(false)}
                            className="text-gray-400 hover:text-gray-600 text-xs"
                        >
                            ✕
                        </button>
                    </div>

                    <input
                        type="email"
                        placeholder="Email"
                        className={`w-full p-2 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:shadow-lg transition-all text-sm`}
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className={`w-full p-2 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:shadow-lg transition-all text-sm`}
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={submitAuth}
                        disabled={authLoading}
                        className="bg-violet-300 rounded-full py-2 text-sm font-semibold hover:bg-violet-400 transition"
                    >
                        {authLoading ? "Processing..." : (isLogin ? "Log In" : "Sign Up")}
                    </button>

                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs text-gray-500 hover:underline"
                    >
                        {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
                    </button>
                </div>
            )}

            <ReactFlow
                nodes = {allNodes}
                edges = {allEdges}
                deleteKeyCode={["Backspace", "Delete"]}
                onNodesDelete={onNodesDelete}
                onDragOver={(event) => event.preventDefault()}
                onDrop={onDropCourse}
                onNodesChange={onChangeNodes}
                onNodeDragStart={(_, node) => {if (node.type === 'term') return; setSelectedNode(node)}}
                onNodeDragStop={(_, node) => {if (node.type === 'term') return; handleNodeDragStop(node)}}
                onEdgesChange={onChangeEdges}
                onConnect={onConnect}
                nodeTypes={nodeTypes}

                onNodeClick={(_, node) => {setSelectedNode(node)}}
                onPaneClick={() => {setSelectedNode(null)}}

                fitView
                proOptions={{ hideAttribution: true }}

                zoomOnPinch = {true}
                preventScrolling = {true}

                minZoom={0.5}
                maxZoom={1}
                translateExtent={[[-500, -550], [4000, 1300]]}

                snapGrid={[0.5, 0.5]}
                snapToGrid={true}
            >
                <Background 
                    variant={BackgroundVariant.Cross}
                    gap={20}
                    size={5} 
                />
                <Controls position="bottom-left" className={`z-50`} showInteractive={false} showFitView={false}/>
            </ReactFlow>
        </div>
    )
}

//export default NodeCourseMap

export default function WrappedMap({
    setSelectedNode, 
    allNodes, 
    setNodes, 
    onChangeNodes, 
    nodeTypes, 
    isLoading, 
    userId,
    allEdges,
    onChangeEdges,
    onConnect}: any){
    if(isLoading){
        return(
            <div className={`w-full h-full bg-white text-4xl text-zinc-200 flex items-center justify-center`}>
                Loading Courses...
            </div>
        )
    }
    
    return (
        <ReactFlowProvider>
            <NodeCourseMap 
                setSelectedNode={setSelectedNode} 
                allNodes={allNodes}
                setNodes={setNodes} 
                onChangeNodes={onChangeNodes} 
                nodeTypes={nodeTypes}
                userId={userId}
                allEdges={allEdges}
                onChangeEdges={onChangeEdges}
                onConnect={onConnect}
            ></NodeCourseMap>
        </ReactFlowProvider>
    )
}