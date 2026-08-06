const fs = require('fs');
let code = fs.readFileSync('src/client-app/ClientApp.tsx', 'utf-8');

// Remove Counselor imports
code = code.replace(/import\s+\{\s*Counselor.*?\}\s+from\s+['"].*?['"];?\n/g, '');
code = code.replace(/import\s+\{.*?OrdersList.*?\}\s+from\s+['"].*?['"];?\n/g, 'import { OrdersList } from "./pages/Counseling/OrdersList";\n');

// Remove specific counselor views
code = code.replace(/\{currentView === "counselor-.*?\n/g, '');

// Replace orders list
code = code.replace(/\{currentView === "orders-list"[\s\S]*?<\/OrdersList>\s*\)\s*\}/g, '{currentView === "orders-list" && <OrdersList key="orders" />}');

// Replace createRoot
code = code.replace(/createRoot\([\s\S]*/, 'export default function ClientApp() {\n  return (\n    <MobileLayout>\n      <ViewManager />\n    </MobileLayout>\n  );\n}');

// Remove original App definition
code = code.replace(/function App\(\) \{[\s\S]*?\}\n/g, '');

// remove createRoot import
code = code.replace(/import\s+\{\s*createRoot\s*\}\s+from\s+['"]react-dom\/client['"];?\n/g, '');
code = code.replace(/import\s+\{\s*StrictMode\s*\}\s+from\s+['"]react['"];?\n/g, '');

fs.writeFileSync('src/client-app/ClientApp.tsx', code);
