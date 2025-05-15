import { useRef } from 'react';
import './App.css'
import Controls from './components/Controls'
import Scene, { SceneRef } from './components/Scene'

function App() {
  const sceneRef = useRef<SceneRef|null>(null);
  return (
    <div id='root'>
      <Scene ref={sceneRef} />
      <Controls sceneRef={sceneRef} />
    </div>
  )
}

export default App
