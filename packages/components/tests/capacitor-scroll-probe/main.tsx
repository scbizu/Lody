import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { Drawer as UiDrawer } from '@lody/ui/drawer';
import { SessionMobileDiffDrawerContent } from '../../src/components/sessions/session-mobile-diff-drawer-content';
import { Drawer, DrawerContent, DrawerTitle } from '../../src/ui/drawer';
import './style.css';

type Mode = 'before' | 'after';
const labels = { before: '修复前 · body Portal', after: '修复后 · 抽屉内 Portal' };
const diffLines = Array.from({ length: 100 }, (_, i) => (
  <div className="diff-line" key={i}>
    <span>{i + 1}</span>
    <code>+ synthetic_diff_line_{i + 1} = true;</code>
  </div>
));
const messages = Array.from({ length: 80 }, (_, i) => (
  <p key={i}>合成聊天消息 {i + 1} — 在 diff 上滑动时，这里应保持原位。</p>
));

function Trial({ mode, onExit }: { mode: Mode; onExit: () => void }) {
  const [open, setOpen] = useState(false);
  const chat = useRef<HTMLDivElement>(null);
  const diff = useRef<HTMLDivElement>(null);
  const chatValue = useRef<HTMLOutputElement>(null);
  const diffValue = useRef<HTMLOutputElement>(null);
  const pointerValue = useRef<HTMLOutputElement>(null);
  const [selected, setSelected] = useState(false);
  const Content = mode === 'after' ? SessionMobileDiffDrawerContent : UiDrawer.Content;
  function read() {
    if (chatValue.current)
      chatValue.current.value = `${Math.round(chat.current?.scrollTop ?? 0)} px`;
    if (diffValue.current)
      diffValue.current.value = `${Math.round(diff.current?.scrollTop ?? 0)} px`;
    if (pointerValue.current) {
      pointerValue.current.value = diff.current
        ? getComputedStyle(diff.current).pointerEvents
        : '未打开';
    }
  }
  return (
    <Drawer direction="right" open onOpenChange={(value) => !value && onExit()}>
      <DrawerContent className="probe-session" aria-describedby={undefined}>
        <DrawerTitle>{labels[mode]}</DrawerTitle>
        <p className="hint">先记住聊天位置，再打开 diff 并上下滑动。聊天位置应保持不变。</p>
        <div className="session-actions" data-vaul-no-drag>
          <button
            onClick={() => {
              setSelected(false);
              setOpen(true);
            }}
          >
            打开 review diff
          </button>
          <button onClick={onExit}>返回选择</button>
        </div>
        <div ref={chat} className="chat" data-probe="chat" data-vaul-no-drag onScroll={read}>
          {messages}
        </div>
        <UiDrawer.Root side="bottom" open={open} onOpenChange={setOpen}>
          <Content side="bottom" className="probe-diff" aria-describedby={undefined}>
            <UiDrawer.Title>Review diff · {mode === 'after' ? '修复后' : '修复前'}</UiDrawer.Title>
            <p className="hint">在下面代码区域上下滑动，观察聊天 / diff 数值。</p>
            <div ref={diff} className="diff-scroll" data-probe="diff" onScroll={read}>
              <button onClick={() => setSelected(true)}>
                {selected ? '选择成功' : '测试行选择'}
              </button>
              {diffLines}
            </div>
          </Content>
        </UiDrawer.Root>
        <aside className="diagnostics" data-vaul-no-drag>
          <div>
            聊天：<output ref={chatValue}>0 px</output> · diff：
            <output ref={diffValue}>0 px</output>
          </div>
          <div>
            diff pointer-events：<output ref={pointerValue}>未读取</output>
          </div>
          <button onClick={read}>读取当前状态</button>
          <button onClick={() => setOpen(false)}>关闭 diff</button>
        </aside>
      </DrawerContent>
    </Drawer>
  );
}

function Probe() {
  const [mode, setMode] = useState<Mode | null>(null);
  return mode ? (
    <Trial key={mode} mode={mode} onExit={() => setMode(null)} />
  ) : (
    <main className="intro">
      <h1>Lody 滚动测试</h1>
      <p>这是合成测试页，使用仓库中的真实抽屉和 diff 容器组件。</p>
      <button onClick={() => setMode('before')}>{labels.before}</button>
      <button onClick={() => setMode('after')}>{labels.after}</button>
      <p>两组测试都从新的弹窗状态开始。先测修复前，再返回选择并测试修复后。</p>
      <details>
        <summary>运行环境</summary>
        <p>{Capacitor.getPlatform()}</p>
        <p>{navigator.userAgent}</p>
      </details>
    </main>
  );
}
createRoot(document.getElementById('root')!).render(<Probe />);
