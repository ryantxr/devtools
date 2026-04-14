import { Layout } from './components/Layout';
import { useStore } from './store';
import { JSONFormatter } from './components/tools/JSONFormatter';
import { JWTDecoder } from './components/tools/JWTDecoder';
import { Base64Converter } from './components/tools/Base64Converter';
import { TimestampConverter } from './components/tools/TimestampConverter';
import { HashGenerator } from './components/tools/HashGenerator';
import { SQLFormatter } from './components/tools/SQLFormatter';
import { YAMLJSONConverter } from './components/tools/YAMLJSONConverter';
import { RegexTester } from './components/tools/RegexTester';
import { CurlConverter } from './components/tools/CurlConverter';

function App() {
  const activeTool = useStore((state) => state.activeTool);

  const renderTool = () => {
    switch (activeTool) {
      case 'json-formatter':
        return <JSONFormatter />;
      case 'jwt-decoder':
        return <JWTDecoder />;
      case 'base64':
        return <Base64Converter />;
      case 'timestamp':
        return <TimestampConverter />;
      case 'hash-generator':
        return <HashGenerator />;
      case 'sql-formatter':
        return <SQLFormatter />;
      case 'yaml-json':
        return <YAMLJSONConverter />;
      case 'regex-tester':
        return <RegexTester />;
      case 'curl-converter':
        return <CurlConverter />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground border-2 border-dashed border-border rounded-xl bg-card/30">
            <h3 className="text-xl font-medium mb-2">Tool Incoming</h3>
            <p>The "{activeTool}" tool is currently being developed.</p>
          </div>
        );
    }
  };

  return (
    <Layout>
      {renderTool()}
    </Layout>
  );
}

export default App;
