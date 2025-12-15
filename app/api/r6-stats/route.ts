import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

// Transforme exec en version async/await
const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");
  // Mapping pour Python : 'pc' -> 'uplay'
  const urlPlatform = searchParams.get("platform") || "uplay";
  const platform = urlPlatform === 'pc' ? 'uplay' : urlPlatform;

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  try {

   // 1. Chemins absolus
   const scriptPath = path.join(process.cwd(),"app", "scripts", "r6.py");
   // ON CIBLE LE PYTHON DU VENV (Celui qui a la librairie)
   const pythonPath = path.join(process.cwd(), "venv", "bin", "python3");
   
   // 2. Commande : "chemin/vers/venv/python" "chemin/script.py" "pseudo" "platform"
   const command = `"${pythonPath}" "${scriptPath}" "${username}" "${platform}"`;
    
    console.log(`🐍 Executing Python: ${command}`);

    // 3. Exécution avec passage des variables d'env (Email/Mdp)
    const { stdout, stderr } = await execAsync(command, {
      env: { ...process.env, PATH: process.env.PATH }, // Important pour trouver pip/python
    });

    if (stderr) {
      console.warn("Python Stderr (Warning):", stderr);
    }

    // 4. Parsing du résultat JSON renvoyé par Python
    // Python peut parfois renvoyer des logs avant le JSON, on cherche le dernier objet JSON valide
    const jsonOutput = stdout.trim();
    
    try {
        const data = JSON.parse(jsonOutput);
        
        if (data.error) {
            return NextResponse.json({ error: data.error }, { status: 404 });
        }
        
        return NextResponse.json(data);

    } catch (parseError) {
        console.error("Failed to parse Python output:", jsonOutput);
        return NextResponse.json({ error: "Invalid JSON from Python script" }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ 
        error: "Execution Failed", 
        details: error.message 
    }, { status: 500 });
  }
}