'use client';

import { Upload, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import statesData from "@/utils/states.json";
import { useRouter } from "next/navigation";

interface EventFormData {
    title: string;
    startDateTime: Date | null;
    endDateTime: Date | null;
    state: string;
    lga: string;
    address: string;
    host: string;
    organizerPhone: string;
    organizerEmail: string;
    flyer: string;
    description: string;
    isPaid: boolean;
    price: string;
    paymentDetails: string;
    labels: string[];
    isRecurring: boolean;
    recurringPattern: string;
    recurrenceInterval: number; // e.g., every 2 weeks
    recurrenceEndType: 'never' | 'after' | 'on'; // How the recurrence ends
    recurrenceEndDate: Date | null;
    recurrenceCount: number; // Number of occurrences (if endType is 'after')
}

const VIBE_LABELS = [
    "Free Drinks 🍹", "Ladies Night 💃", "Strictly by IV 📩",
    "Pool Party 🏊", "Costume Required 🎭", "21+ Only 🔞",
    "Live Music 🎵", "Shisha Available 💨"
];

export default function CreateEventPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<EventFormData>({
        title: "",
        startDateTime: null,
        endDateTime: null,
        state: "",
        lga: "",
        address: "",
        host: "",
        organizerPhone: "",
        organizerEmail: "",
        flyer: "",
        description: "",
        isPaid: false,
        price: "",
        paymentDetails: "",
        labels: [],
        isRecurring: false,
        recurringPattern: "weekly",
        recurrenceInterval: 1, // Every 1 week/day/month
        recurrenceEndType: 'never',
        recurrenceEndDate: null,
        recurrenceCount: 10,
    });

    const [dragActive, setDragActive] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newState = e.target.value;
        setFormData(prev => ({
            ...prev,
            state: newState,
            lga: "" // Reset LGA when state changes
        }));
    };

    const availableLgas = React.useMemo(() => {
        const selectedStateData = statesData.find(s => s.state === formData.state);
        return selectedStateData ? selectedStateData.lgas : [];
    }, [formData.state]);

    const toggleLabel = (label: string) => {
        setFormData(prev => ({
            ...prev,
            labels: prev.labels.includes(label) ? prev.labels.filter(l => l !== label) : [...prev.labels, label]
        }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/dashboard');
            } else {
                console.error("Failed to create event");
                // Handle error (e.g., show toast)
            }
        } catch (error) {
            console.error("An error occurred", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 md:mb-8 flex-col md:flex-row gap-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Create New Event</h1>
                    <p className="text-slate-400 text-sm md:text-base">Host your next big party in minutes.</p>
                </div>
                <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Step {step} of 3</div>
            </div>

            <div className="bg-[#131722] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">

                {/* Progress Bar */}
                <div className="h-1 w-full bg-slate-800">
                    <div
                        className="h-full bg-white transition-all duration-500 ease-in-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <form onSubmit={handleSubmit} className="p-5 md:p-10">

                    {/* Step 1: Basics */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Event Basics</h2>
                                <p className="text-slate-400 text-sm">Tell us about your party</p>
                            </div>

                            <div className="space-y-5">
                                <Input
                                    label="Event Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Sunset Rooftop Party"
                                    className="bg-[#0B0F17] border-slate-800"
                                    autoFocus
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Start</label>
                                        <DatePicker
                                            selected={formData.startDateTime}
                                            onChange={(date) => setFormData(prev => ({ ...prev, startDateTime: date }))}
                                            showTimeSelect
                                            timeIntervals={15}
                                            dateFormat="MMM d, yyyy h:mm aa"
                                            placeholderText="Select start"
                                            className="w-full bg-[#0B0F17] border border-slate-800 rounded-xl px-3 py-2.5 md:px-4 md:py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                                            wrapperClassName="w-full"
                                            calendarClassName="react-datepicker-dark"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">End</label>
                                        <DatePicker
                                            selected={formData.endDateTime}
                                            onChange={(date) => setFormData(prev => ({ ...prev, endDateTime: date }))}
                                            showTimeSelect
                                            timeIntervals={15}
                                            dateFormat="MMM d, yyyy h:mm aa"
                                            placeholderText="Select end"
                                            minDate={formData.startDateTime || undefined}
                                            className="w-full bg-[#0B0F17] border border-slate-800 rounded-xl px-3 py-2.5 md:px-4 md:py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                                            wrapperClassName="w-full"
                                            calendarClassName="react-datepicker-dark"
                                        />
                                    </div>
                                </div>

                                {/* Repeat Option - Simplified */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="repeat"
                                        checked={formData.isRecurring}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                                        className="w-5 h-5 rounded border-slate-700 bg-[#0B0F17] text-white focus:ring-2 focus:ring-white/30"
                                    />
                                    <label htmlFor="repeat" className="text-sm font-medium text-white cursor-pointer flex-1">
                                        Repeat this event
                                    </label>
                                    {formData.isRecurring && (
                                        <select
                                            name="recurringPattern"
                                            value={formData.recurringPattern}
                                            onChange={handleChange}
                                            className="bg-[#0B0F17] border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 appearance-none"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    )}
                                </div>
                                {formData.isRecurring && (
                                    <div className="">
                                        <DatePicker
                                            selected={formData.recurrenceEndDate}
                                            onChange={(date) => setFormData(prev => ({ ...prev, recurrenceEndDate: date, recurrenceEndType: date ? 'on' : 'never' }))}
                                            dateFormat="MMM d, yyyy"
                                            placeholderText="Ends on (optional)"
                                            minDate={formData.startDateTime || undefined}
                                            isClearable
                                            className="w-full bg-[#0B0F17] border border-slate-800 rounded-xl px-3 py-2.5 md:px-4 md:py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                                            wrapperClassName="w-full"
                                            calendarClassName="react-datepicker-dark"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Leave empty to repeat indefinitely</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">State</label>
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleStateChange}
                                            className="w-full bg-[#0B0F17] border border-slate-800 rounded-xl px-3 py-2.5 md:px-4 md:py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none"
                                        >
                                            <option value="">Select State</option>
                                            {statesData.map((s) => (
                                                <option key={s.alias} value={s.state}>
                                                    {s.state}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">LGA / City</label>
                                        <select
                                            name="lga"
                                            value={formData.lga}
                                            onChange={handleChange}
                                            disabled={!formData.state}
                                            className="w-full bg-[#0B0F17] border border-slate-800 rounded-xl px-3 py-2.5 md:px-4 md:py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select LGA</option>
                                            {availableLgas.map((lga) => (
                                                <option key={lga} value={lga}>
                                                    {lga}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <Input
                                    label="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="e.g. 123 Ocean Drive"
                                    className="bg-[#0B0F17] border-slate-800"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Details */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Details & Contact</h2>
                                <p className="text-slate-400 text-sm">Set the vibe and how to reach you</p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="What can guests expect? Music, dress code, special guests..."
                                        className="w-full bg-[#0B0F17] border border-slate-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Vibe Labels</label>
                                    <div className="flex flex-wrap gap-2">
                                        {VIBE_LABELS.map(label => (
                                            <button
                                                key={label}
                                                type="button"
                                                onClick={() => toggleLabel(label)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${formData.labels.includes(label)
                                                    ? 'bg-white text-slate-900 border-white'
                                                    : 'bg-[#0B0F17] border-slate-800 text-slate-400 hover:border-slate-600'
                                                    }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                                    <Input
                                        label="Organizer Name"
                                        name="host"
                                        value={formData.host}
                                        onChange={handleChange}
                                        placeholder="e.g. Party Kings"
                                        className="bg-[#0B0F17] border-slate-800"
                                    />
                                    <Input
                                        label="Phone / WhatsApp"
                                        name="organizerPhone"
                                        value={formData.organizerPhone}
                                        onChange={handleChange}
                                        placeholder="+234..."
                                        className="bg-[#0B0F17] border-slate-800"
                                    />
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Step 3: Visuals & Tickets */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Final Touches</h2>
                                <p className="text-slate-400 text-sm">Add visuals and set pricing</p>
                            </div>

                            <div className="space-y-5">
                                {/* Flyer Upload */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Event Flyer</label>
                                    <div
                                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${dragActive
                                            ? 'border-white bg-white/5'
                                            : 'border-slate-800 bg-[#0B0F17] hover:border-slate-600'
                                            }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                                                <Upload className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <p className="text-sm font-medium text-white">Click to upload or drag and drop</p>
                                            <p className="text-xs text-slate-500">PNG, JPG (max. 5MB)</p>
                                        </div>
                                    </div>
                                    <input
                                        name="flyer"
                                        placeholder="Or paste image URL..."
                                        value={formData.flyer}
                                        onChange={handleChange}
                                        className="w-full bg-[#0B0F17] border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm mt-3 focus:outline-none focus:border-white/30"
                                    />
                                </div>

                                {/* Ticket Type */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Entry Type</label>
                                    <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-1 flex">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, isPaid: false }))}
                                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${!formData.isPaid ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-300'
                                                }`}
                                        >
                                            Free
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, isPaid: true }))}
                                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${formData.isPaid ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-300'
                                                }`}
                                        >
                                            Paid
                                        </button>
                                    </div>
                                </div>

                                {formData.isPaid && (
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Price (₦)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="5000"
                                                className="w-full bg-[#0B0F17] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-white/30"
                                            />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₦</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between mt-8 md:mt-10 pt-6 border-t border-slate-800">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors"
                            >
                                <ChevronLeft size={18} /> Back
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm md:text-base"
                            >
                                Continue <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 bg-white text-slate-900 px-6 py-2.5 md:px-8 md:py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-lg text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Publishing..." : (
                                    <>
                                        <Upload size={18} /> Publish Event
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                </form>
            </div>
        </div>
    );
}
