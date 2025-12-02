import React, { useState, useEffect } from 'react';
import { BottomNavBar } from '../components/BottomNavBar';
import Header from '../components/Header';
import { Calendar, Image, FileText, Video, ExternalLink, Phone } from 'lucide-react';
import api, { BASE_IMAGE_URL } from '../utils/Api';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const MediaTypeIcon = ({ type }) => {
    switch (type.toLowerCase()) {
        case 'images':
        case 'image': // Add 'image' to handle potential variations
            return <Image size={18} className="text-blue-500" />;
        case 'video':
            return <Video size={18} className="text-purple-500" />;
        default:
            return <FileText size={18} className="text-gray-500" />;
    }
};

const SubmissionCard = ({ submission }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{submission.name}</h3>
                    <div className="flex flex-wrap gap-4 mt-1">
                        <div className="flex items-center gap-1">
                            <Calendar size={16} className="text-gray-400" />
                            <span className="text-xs text-gray-500">
                                {new Date(submission.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Phone size={16} className="text-gray-400" />
                            <span className="text-xs text-gray-500">{submission.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MediaTypeIcon type={submission.mediaType} />
                            <span className="text-xs text-gray-500 capitalize">
                                {submission.mediaType} ({submission.mediaFiles.length})
                            </span>
                        </div>
                    </div>
                </div>

                {/* <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-[#F7941C] font-medium flex items-center gap-1 ml-2"
                >
                    {expanded ? 'Show less' : 'View files'}
                </button> */}
            </div>

            <div className="mt-3">
                <p className="text-xs text-gray-500 font-medium">Remark:</p>
                <p className="text-sm text-gray-700 break-words">{submission.remark || 'No remark'}</p>
            </div>

            {expanded && (
                <div className="mt-3 border-t pt-3 border-gray-100">
                    <p className="text-xs text-gray-500 font-medium mb-2">Media Files:</p>
                    <div className="grid grid-cols-4 gap-2">
                        {submission.mediaFiles.map((file, index) => (
                            <div
                                key={index}
                                className="relative rounded-lg bg-gray-100 h-20 flex items-center justify-center overflow-hidden group"
                            >
                                {(['images', 'image'].includes(submission.mediaType.toLowerCase())) ? (
                                    <img
                                        src={file}
                                        alt="Submission"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                                    />
                                ) : submission.mediaType.toLowerCase() === 'video' ? (
                                    <video src={file} className="w-full h-full object-cover" controls />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <FileText size={24} className="text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all">
                                    <a href={file} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink
                                            size={18}
                                            className="text-white opacity-0 group-hover:opacity-100 transition-all"
                                        />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-10">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText size={24} className="text-gray-400" />
        </div>
        <h3 className="text-gray-800 font-medium mb-1">No submissions yet</h3>
        <p className="text-gray-500 text-sm text-center">
            Complete challenges to see your submission history here
        </p>
    </div>
);

const extractImagePath = (imageString) => {
    try {
        // If it's already a full URL, return it as is
        if (imageString.startsWith('http')) {
            return imageString;
        }
        // Remove surrounding brackets and quotes from JSON string, decode URL components
        const cleanedString = decodeURIComponent(imageString).replace(/^\["|"\]$/g, "");
        return `${BASE_IMAGE_URL}/${cleanedString}`;
    } catch (error) {
        console.error("Error parsing image path:", error);
        return "/placeholder-image.jpg"; // Fallback image
    }
};

const SubmissionHistory = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get(`/user/get/challengeForm`);

                const dataArray = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.data)
                    ? response.data.data
                    : [response.data]; // Wrap in an array if it's a single object


                // Transform the data with error handling and image path extraction
                const transformedData = dataArray.map((item) => {
                    let mediaFiles = [];
                    try {
                        // Handle case where mediaFiles might be a JSON string or array
                        mediaFiles = typeof item.mediaFiles === 'string'
                            ? JSON.parse(item.mediaFiles || '[]').map((file) => extractImagePath(file))
                            : Array.isArray(item.mediaFiles)
                            ? item.mediaFiles.map((file) => extractImagePath(file))
                            : [];
                    } catch (e) {
                        console.error(`Error parsing mediaFiles for item ${item.id}:`, e);
                        mediaFiles = []; // Fallback to empty array if parsing fails
                    }

                    return {
                        id: item.id,
                        name: item.challengeName || item.name, // Use challengeName if available, fallback to name
                        phone: item.phone,
                        createdAt: item.createdAt,
                        remark: item.remark,
                        mediaType: item.mediaType || 'images', // Default to 'images' if not specified
                        mediaFiles: mediaFiles,
                    };
                });

                setSubmissions(transformedData);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen text-gray-900 font-poppins bg-gray-50">
            <Header title="Submission History" />

            <div className="px-4 py-4 pb-24">
                {loading ? (
                    <Loader />
                ) : submissions.length > 0 ? (
                    <>
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold">Your Submissions</h2>
                            <p className="text-sm text-gray-500">View your challenge submission history</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {submissions.map((submission) => (
                                <SubmissionCard key={submission.id} submission={submission} />
                            ))}
                        </div>
                    </>
                ) : (
                    <EmptyState />
                )}
            </div>

            <BottomNavBar />
        </div>
    );
};

export default SubmissionHistory;