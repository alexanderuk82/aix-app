"use client";
import { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileAudio2, Trash2 } from "lucide-react";
import Animation from "./Animation";
import PasteText from "./pasteText.jsx";

import { CloudUpload } from "lucide-react";

const UploadAudio = () => {
	const { toast } = useToast();

	const [isProcessing, setIsProcessing] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [file, setFile] = useState(null);
	const [transcript, setTranscript] = useState("");
	const fileInputRef = useRef(null);

	// Drag and drop
	const handleDragOver = (event) => {
		event.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (event) => {
		event.preventDefault();
		setIsDragging(false);
		const selectedFile = event.dataTransfer.files[0];
		setFile(selectedFile);
	};

	const handleRemoveFile = () => {
		setFile(null);
		fileInputRef.current.value = ""; // Clear file input
		toast({
			title: "File Removed 🗑️",
			description: "The selected file has been removed."
		});
	};

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleUpload = async () => {
		if (!file) return;

		setIsProcessing(true); // Start processing
		try {
			// Subir el archivo a AssemblyAI
			const response = await axios.post(
				"https://api.assemblyai.com/v2/upload",
				file,
				{
					headers: {
						authorization: "b0509ec6b0b0491db39599d4a9b8b3c9",
						"content-type": "multipart/form-data"
					}
				}
			);

			const audioUrl = response.data.upload_url;

			// Crear la transcripción
			const transcriptResponse = await axios.post(
				"https://api.assemblyai.com/v2/transcript",
				{ audio_url: audioUrl },
				{
					headers: { authorization: "b0509ec6b0b0491db39599d4a9b8b3c9" }
				}
			);

			const transcriptId = transcriptResponse.data.id;

			// Obtener la transcripción
			let status = "processing";
			while (status === "processing") {
				const result = await axios.get(
					`https://api.assemblyai.com/v2/transcript/${transcriptId}`,
					{
						headers: { authorization: "b0509ec6b0b0491db39599d4a9b8b3c9" }
					}
				);
				status = result.data.status;
				if (status === "completed") {
					setTranscript(result.data.text);
					setIsProcessing(false); // End processing
					break;
				}
				await new Promise((r) => setTimeout(r, 5000)); // Esperar 5 segundos antes de la siguiente verificación
			}
		} catch (error) {
			console.error("Error uploading or transcribing the file:", error);
			setIsProcessing(false); // End processing
			toast({
				title: "Error",
				description: "There was an error processing the file. Please try again."
			});
		}
	};

	return (
		<div>
			<div className="w-full px-4 mx-auto text-center space-y-2 mb-4 lg:mb-6">
				<h1 className="text-3xl text-center">
					{transcript ? "We have your file" : "What have you been working on?"}
				</h1>
				<p className="font-normal">
					{transcript
						? "Check your transcription below, is it what you were looking for? 🙂 "
						: "Add your file below and we'll transcribe it for you."}
				</p>
			</div>
			{transcript ? (
				<PasteText transcription={transcript} />
			) : (
				<div
					className={`flex flex-col space-y-4 items-center justify-center w-full ${
						isDragging
							? "dark:border-teal-600 light:border-teal-700"
							: "border-gray-300"
					}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<label
						htmlFor="dropzone-file"
						className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${
							isDragging
								? "dark:border-teal-600 border-teal-700 bg-teal-100 dark:bg-teal-700"
								: "border-gray-300"
						}`}
					>
						<div className="flex flex-col items-center justify-center pt-5 pb-6 gap-3">
							<CloudUpload width={40} height={40} />
							<p className="mb-2 text-sm text-gray-500 dark:text-gray-200">
								Click to upload or drag and drop
							</p>
							<p className="px-2 text-xs text-gray-500 dark:text-gray-200 text-center font-normal">
								Only .mp3, .wav, .m4a, .wma, and .aac files are accepted (MAX.
								2.2GB)
							</p>
						</div>
						<input
							type="file"
							onChange={handleFileChange}
							accept=".mp3, .wav, .m4a, .wma, .aac"
							id="dropzone-file"
							className="hidden"
							ref={fileInputRef}
						/>
					</label>

					{file && (
						<div className="flex flex-col w-full space-y-3">
							<h2>Uploaded File</h2>

							<div className="flex items-end justify-between w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 md:p-4 gap-2 ">
								<div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 ">
									<FileAudio2 />
									<p className="w-fit inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs my-8 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300 border-transparent text-slate-800 shadow hover:bg-amber-400/80 bg-amber-400">
										Selected file: {file.name}
									</p>
								</div>

								<Button
									variant="destructive"
									size="icon"
									className="remove-file"
									onClick={handleRemoveFile}
								>
									<Trash2 className="h-4 w-4 " />
								</Button>
							</div>
						</div>
					)}
				</div>
			)}

			{!isProcessing && !transcript && (
				<Button
					size="lg"
					className="mt-6 w-full md:w-fit"
					onClick={handleUpload}
				>
					Transcribe File
				</Button>
			)}

			{isProcessing && (
				<div className="w-full container mx-auto text-center mt-4">
					<Animation />
					<p>Processing...</p>
				</div>
			)}
		</div>
	);
};

export default UploadAudio;
