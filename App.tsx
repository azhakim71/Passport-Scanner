
import React, { useState, useEffect } from 'react';
import { extractPassportInfo } from './geminiService';
import { PassportData, SavedPassport } from './types';
import { 
  Scan, 
  Upload, 
  FileText, 
  Save, 
  Trash2, 
  CheckCircle, 
  Loader2, 
  CreditCard as IDIcon,
  ShieldCheck,
  History,
  User,
  Users,
  Home,
  PhoneCall,
  Eye,
  Code,
  X,
  Copy,
  ExternalLink
} from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'reader' | 'api'>('reader');
  const [selectedRecord, setSelectedRecord] = useState<SavedPassport | null>(null);
  const [formData, setFormData] = useState<PassportData>({
    passportNumber: '', surname: '', givenNames: '', fullName: '',
    fatherName: '', motherName: '', nationality: '', dateOfBirth: '',
    sex: '', placeOfBirth: '', permanentAddress: '', dateOfIssue: '',
    dateOfExpiry: '', issuingAuthority: '', emergencyContactName: '',
    emergencyContactRelation: '', emergencyContactAddress: '', emergencyContactPhone: ''
  });
  const [savedPassports, setSavedPassports] = useState<SavedPassport[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('saved_passports_v2');
    if (stored) setSavedPassports(JSON.parse(stored));
  }, []);

  const saveToLocalStorage = (data: SavedPassport[]) => {
    localStorage.setItem('saved_passports_v2', JSON.stringify(data));
    setSavedPassports(data);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setMessage(null);
    setActiveTab('reader');

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      setPreview(e.target?.result as string);
      try {
        const result = await extractPassportInfo(base64, file.type);
        setFormData(result);
        setMessage({ type: 'success', text: 'Data extracted successfully!' });
      } catch (err) {
        setMessage({ type: 'error', text: 'Extraction failed. Try a clearer image.' });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!formData.passportNumber) {
      setMessage({ type: 'error', text: 'Passport Number is required.' });
      return;
    }
    const newEntry: SavedPassport = { ...formData, id: crypto.randomUUID(), timestamp: Date.now() };
    saveToLocalStorage([newEntry, ...savedPassports]);
    setMessage({ type: 'success', text: 'Passport record saved.' });
    setPreview(null);
    setFormData({
      passportNumber: '', surname: '', givenNames: '', fullName: '',
      fatherName: '', motherName: '', nationality: '', dateOfBirth: '',
      sex: '', placeOfBirth: '', permanentAddress: '', dateOfIssue: '',
      dateOfExpiry: '', issuingAuthority: '', emergencyContactName: '',
      emergencyContactRelation: '', emergencyContactAddress: '', emergencyContactPhone: ''
    });
  };

  const handleChange = (field: keyof PassportData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const InputField = ({ label, value, field, placeholder = "", readOnly = false }: { label: string, value: string, field: keyof PassportData, placeholder?: string, readOnly?: boolean }) => (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <input 
        value={value || ''} 
        readOnly={readOnly}
        onChange={(e) => !readOnly && handleChange(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-1.5 border rounded text-sm outline-none transition-all ${readOnly ? 'bg-slate-50 border-transparent text-slate-600 font-medium' : 'bg-white border-slate-200 focus:ring-2 focus:ring-blue-500'}`}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200">
            <ShieldCheck size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">PassPortScan <span className="text-blue-600">Pro</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex bg-slate-100 p-1 rounded-lg mr-4">
            <button 
              onClick={() => setActiveTab('reader')}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'reader' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Reader
            </button>
            <button 
              onClick={() => setActiveTab('api')}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'api' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Developer API
            </button>
          </nav>
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-semibold flex items-center gap-2">
            <Upload size={16} /> Scan Passport
            <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileUpload} />
          </label>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'reader' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b bg-slate-50 flex items-center gap-2 text-slate-600 font-semibold">
                <Scan size={18} /> OCR Reader & Editor
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center min-h-[300px] overflow-hidden">
                  {loading ? (
                    <div className="text-center">
                      <Loader2 className="animate-spin text-blue-600 mx-auto mb-2" size={32} />
                      <p className="text-xs text-slate-500">Analyzing Document...</p>
                    </div>
                  ) : preview ? (
                    <img src={preview} className="max-w-full h-auto object-contain max-h-[400px]" alt="Scan Preview" />
                  ) : (
                    <div className="text-center text-slate-400">
                      <FileText size={48} className="mx-auto mb-2 opacity-20" />
                      <p className="text-xs">Preview Area</p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-xs font-black text-blue-600 uppercase flex items-center gap-2 mb-3"><User size={14}/> Primary Identity</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2"><InputField label="Full Name" value={formData.fullName} field="fullName" /></div>
                      <InputField label="Passport No" value={formData.passportNumber} field="passportNumber" />
                      <InputField label="Nationality" value={formData.nationality} field="nationality" />
                      <InputField label="Date of Birth" value={formData.dateOfBirth} field="dateOfBirth" />
                      <InputField label="Sex" value={formData.sex} field="sex" />
                      <InputField label="Place of Birth" value={formData.placeOfBirth} field="placeOfBirth" />
                      <InputField label="Authority" value={formData.issuingAuthority} field="issuingAuthority" />
                    </div>
                  </section>
                </div>
              </div>

              <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <h3 className="text-xs font-black text-blue-600 uppercase flex items-center gap-2 mb-3"><Users size={14}/> Family Details</h3>
                  <div className="space-y-3">
                    <InputField label="Father's Name" value={formData.fatherName} field="fatherName" />
                    <InputField label="Mother's Name" value={formData.motherName} field="motherName" />
                  </div>
                </section>
                <section>
                  <h3 className="text-xs font-black text-blue-600 uppercase flex items-center gap-2 mb-3"><Home size={14}/> Permanent Address</h3>
                  <textarea 
                    value={formData.permanentAddress} 
                    onChange={(e) => handleChange('permanentAddress', e.target.value)}
                    className="w-full h-24 p-3 bg-white border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Street, City, Post Code, District"
                  />
                </section>
              </div>

              <div className="p-6 pt-0 border-t mt-4">
                <h3 className="text-xs font-black text-blue-600 uppercase flex items-center gap-2 mb-4 mt-4"><PhoneCall size={14}/> Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Contact Name" value={formData.emergencyContactName} field="emergencyContactName" />
                  <InputField label="Relationship" value={formData.emergencyContactRelation} field="emergencyContactRelation" />
                  <div className="md:col-span-2">
                    <InputField label="Address" value={formData.emergencyContactAddress} field="emergencyContactAddress" />
                  </div>
                  <InputField label="Phone / Telephone" value={formData.emergencyContactPhone} field="emergencyContactPhone" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t flex items-center justify-between">
                <div className="flex gap-4">
                  <InputField label="Issue Date" value={formData.dateOfIssue} field="dateOfIssue" />
                  <InputField label="Expiry Date" value={formData.dateOfExpiry} field="dateOfExpiry" />
                </div>
                <button onClick={handleSave} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                  <Save size={18} /> Save Record
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8">
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-4">
                    <Code size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Developer API</h2>
                  <p className="text-slate-500">Integrate our world-class passport OCR engine into your own application.</p>
                </div>

                <div className="bg-slate-900 rounded-xl p-6 text-slate-300 font-mono text-sm relative">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Copy size={16} /></button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-blue-400">// API Endpoint (Mock)</p>
                    <p><span className="text-purple-400">POST</span> https://api.passportscanpro.com/v1/extract</p>
                    <p className="text-blue-400 mt-4">// Request Payload</p>
                    <p className="text-green-400">{`{
  "image": "base64_string_here",
  "apiKey": "pp_live_8kdj39s2l01skdj3"
}`}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-xl space-y-2">
                    <h4 className="font-bold flex items-center gap-2"><ShieldCheck size={16} className="text-green-500"/> App Secret</h4>
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border font-mono text-xs overflow-hidden">
                      <span className="truncate">pp_live_8kdj39s2l01skdj3</span>
                      <button className="ml-auto text-slate-400"><Copy size={12}/></button>
                    </div>
                  </div>
                  <div className="p-4 border rounded-xl space-y-2">
                    <h4 className="font-bold flex items-center gap-2"><ExternalLink size={16} className="text-blue-500"/> Documentation</h4>
                    <p className="text-xs text-slate-500">Read our full guide on how to handle PDF and multi-page documents.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {message && <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</div>}
        </div>

        {/* Sidebar History */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-160px)] sticky top-24">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between font-semibold">
              <div className="flex items-center gap-2"><History size={18} /> Recent Scans</div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{savedPassports.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {savedPassports.map(p => (
                <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all relative group">
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setSelectedRecord(p)} className="p-1.5 bg-white shadow-sm border rounded-lg text-blue-600 hover:bg-blue-50">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => saveToLocalStorage(savedPassports.filter(x => x.id !== p.id))} className="p-1.5 bg-white shadow-sm border rounded-lg text-red-500 hover:bg-red-50">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-2 pr-12">
                    <div className="bg-blue-100 p-2 rounded text-blue-600 shrink-0"><IDIcon size={16} /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 leading-none truncate">{p.fullName || 'Unnamed'}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">{p.passportNumber}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] border-t pt-2 mt-2">
                    <div className="text-slate-500">Nationality: <span className="text-slate-800 font-bold">{p.nationality}</span></div>
                    <div className="text-slate-500 text-right">Expires: <span className="text-slate-800 font-bold">{p.dateOfExpiry}</span></div>
                  </div>
                </div>
              ))}
              {savedPassports.length === 0 && (
                <div className="text-center py-20 text-slate-300">
                  <History size={48} className="mx-auto mb-2 opacity-10" />
                  <p className="text-sm">No records saved yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                  <IDIcon size={20} />
                </div>
                <h2 className="font-bold text-slate-800">Passport View: {selectedRecord.passportNumber}</h2>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Visual Details */}
                <div className="space-y-8">
                  <section>
                    <h3 className="text-xs font-black text-blue-600 uppercase flex items-center gap-2 mb-4 border-b pb-1"><User size={14}/> Primary Identity</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <InputField label="Full Name" value={selectedRecord.fullName} field="fullName" readOnly />
                      <InputField label="Passport Number" value={selectedRecord.passportNumber} field="passportNumber" readOnly />
                      <InputField label="Nationality" value={selectedRecord.nationality} field="nationality" readOnly />
                      <InputField label="Date of Birth" value={selectedRecord.dateOfBirth} field="dateOfBirth" readOnly />
                      <InputField label="Sex" value={selectedRecord.sex} field="sex" readOnly />
                      <InputField label="Place of Birth" value={selectedRecord.placeOfBirth} field="placeOfBirth" readOnly />
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-black text-blue-600 uppercase flex items-center gap-2 mb-4 border-b pb-1"><Users size={14}/> Family Relationship</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <InputField label="Father's Name" value={selectedRecord.fatherName} field="fatherName" readOnly />
                      <InputField label="Mother's Name" value={selectedRecord.motherName} field="motherName" readOnly />
                    </div>
                  </section>
                </div>

                {/* Secondary Details */}
                <div className="space-y-8">
                  <section>
                    <h3 className="text-xs font-black text-blue-600 uppercase flex items-center gap-2 mb-4 border-b pb-1"><Home size={14}/> Address Information</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Permanent Address</label>
                        <p className="text-sm p-3 bg-slate-50 rounded border border-transparent text-slate-700 min-h-[80px]">
                          {selectedRecord.permanentAddress || 'Not recorded'}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-black text-blue-600 uppercase flex items-center gap-2 mb-4 border-b pb-1"><PhoneCall size={14}/> Emergency Contact</h3>
                    <div className="grid grid-cols-1 gap-4 bg-blue-50/30 p-4 rounded-xl border border-blue-100">
                      <InputField label="Name" value={selectedRecord.emergencyContactName} field="emergencyContactName" readOnly />
                      <InputField label="Relation" value={selectedRecord.emergencyContactRelation} field="emergencyContactRelation" readOnly />
                      <InputField label="Phone" value={selectedRecord.emergencyContactPhone} field="emergencyContactPhone" readOnly />
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Address</label>
                        <p className="text-xs text-slate-600 italic leading-relaxed">
                          {selectedRecord.emergencyContactAddress || 'No specific address provided'}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t flex justify-between items-center text-slate-400">
                <div className="flex gap-8">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter block">Issue Date</span>
                    <span className="text-sm text-slate-600 font-bold">{selectedRecord.dateOfIssue}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter block">Expiry Date</span>
                    <span className="text-sm text-slate-600 font-bold">{selectedRecord.dateOfExpiry}</span>
                  </div>
                </div>
                <div className="text-xs">
                  Scanned on {new Date(selectedRecord.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t flex justify-end">
              <button onClick={() => setSelectedRecord(null)} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all">
                Close Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-slate-400 text-[10px] py-8 border-t border-slate-100">
        &copy; 2024 PassPortScan Pro • Secured via Local Storage • Powered by Gemini 3.0 Flash 
        <br/>
        Authorized for Personal & Enterprise Use
      </footer>
    </div>
  );
};

export default App;
