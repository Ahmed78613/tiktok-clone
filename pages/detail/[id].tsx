import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { GoVerified } from "react-icons/go";
import { MdOutlineCancel } from "react-icons/md";
import { BsFillPlayFill } from "react-icons/bs";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { NextPage } from "next";
import { Video } from "../../utils/types";
import useAuthStore from "../../store/authStore";
import { Comments, LikeButton } from "../../components";

interface Props {
	postDetails: Video;
}

const Detail: NextPage<Props> = ({ postDetails }) => {
	const [post, setPost] = useState(postDetails);
	const [playing, setPlaying] = useState<boolean>(false);
	const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
	const [comment, setComment] = useState<string>("");
	const [isPostingComment, setIsPostingComment] = useState<boolean>(false);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const router = useRouter();

	const { userProfile }: any = useAuthStore();

	useEffect(() => {
		if (post && videoRef?.current) {
			videoRef.current.muted = isVideoMuted;
		}
	}, [post, isVideoMuted]);

	const onVideoClick = () => {
		if (playing) {
			videoRef?.current?.pause();
			setPlaying(false);
		} else {
			videoRef?.current?.play();
			setPlaying(true);
		}
	};

	const handleLike = async (like: boolean) => {
		if (userProfile) {
			const { data } = await axios.put(`${BASE_URL}/api/like`, {
				userId: userProfile._id,
				postId: post._id,
				like,
			});
			setPost({ ...post, likes: data.likes });
		}
	};

	const addComment = async (e: React.FormEvent) => {
		e.preventDefault();

		if (userProfile && comment) {
			setIsPostingComment(true);

			const { data } = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
				userId: userProfile._id,
				comment,
			});

			setPost({ ...post, comments: data.comments });
			setComment("");
			setIsPostingComment(false);
		}
	};

	if (!post) return null;

	return (
		<div className="absolute top-0 left-0 flex flex-wrap w-full bg-white lg:flex-nowrap">
			<div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-black">
				<div className="absolute z-50 flex gap-6 top-6 left-2 lg:left-6">
					<p className="cursor-pointer" onClick={() => router.back()}>
						<MdOutlineCancel className="text-white text-[35px]" />
					</p>
				</div>
				<div className="relative">
					<div className="lg:h-[100vh] h-[60vh]">
						<video
							ref={videoRef}
							loop
							onClick={onVideoClick}
							src={post.video.asset.url}
							className="h-full cursor-pointer"
						></video>
					</div>
					<div className="absolute top-[45%] left-[45%] cursor-pointer">
						{!playing && (
							<button onClick={onVideoClick}>
								<BsFillPlayFill className="text-6xl text-white lg:text-8xl" />
							</button>
						)}
					</div>
				</div>

				<div className="absolute cursor-pointer b-5 lg:bottom-10 right-5 lg:r-10">
					{isVideoMuted ? (
						<button onClick={() => setIsVideoMuted(false)}>
							<HiVolumeOff className="text-2xl text-white lg:text-4xl" />
						</button>
					) : (
						<button onClick={() => setIsVideoMuted(true)}>
							<HiVolumeUp className="text-2xl text-white lg:text-4xl" />
						</button>
					)}
				</div>
			</div>
			<div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
				<div className="mt-10 lg:mt-20">
					<div className="flex gap-3 p-2 font-semibold rounded cursor-pointer">
						<div className="w-20 h-20 ml-4 md:w-16 md:h-16">
							<Link href="/">
								<>
									<Image
										width={62}
										height={62}
										className="rounded-full"
										src={post.postedBy.image}
										alt="profile photo"
										layout="responsive"
									/>
								</>
							</Link>
						</div>
						<div>
							<Link href="/">
								<div className="flex flex-col gap-2 mt-1">
									<p className="flex items-center gap-2 font-bold md:text-md text-primary">
										{post.postedBy.userName}{" "}
										<GoVerified className="text-blue-400 text-md " />
									</p>
									<p className="hidden text-xs font-medium text-gray-500 capitalize md:block">
										{post.postedBy.userName}
									</p>
								</div>
							</Link>
						</div>
					</div>

					<p className="px-10 text-lg text-gray-600">{post.caption}</p>
					<div className="px-10 mt-10">
						{userProfile && (
							<LikeButton
								likes={post.likes}
								handleLike={() => handleLike(true)}
								handleDislike={() => handleLike(false)}
							/>
						)}
					</div>
					<Comments
						comment={comment}
						setComment={setComment}
						addComment={addComment}
						isPostingComment={isPostingComment}
						comments={post.comments}
					/>
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps = async ({
	params: { id },
}: {
	params: { id: string };
}) => {
	const { data } = await axios.get(`${BASE_URL}/api/post/${id}`);

	return {
		props: {
			postDetails: data,
		},
	};
};

export default Detail;
