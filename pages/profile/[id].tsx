import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GoVerified } from "react-icons/go";
import axios from "axios";
import { VideoCard, NoResults } from "../../components";
import { IUser, Video } from "../../types";
import { BASE_URL } from "../../utils";
import { NextPage } from "next";

interface Props {
	data: {
		user: IUser;
		userVideos: Video[];
		userLikedVideos: Video[];
	};
}

const Profile: NextPage<Props> = ({ data }) => {
	const [showUserVideos, setShowUserVideos] = useState<boolean>(true);
	const [videosList, setVideosList] = useState<Video[]>([]);
	const { user, userVideos, userLikedVideos } = data;

	const videos = showUserVideos ? "border-b-2 border-black" : "text-gray-400";
	const liked = !showUserVideos ? "border-b-2 border-black" : "text-gray-400";

	useEffect(() => {
		if (showUserVideos) {
			setVideosList(userVideos);
		} else setVideosList(userLikedVideos);
	}, [showUserVideos, userLikedVideos, userVideos]);

	return (
		<div className="w-full">
			<div className="flex w-full gap-6 mb-4 bg-white md:gap-10">
				<div className="w-16 h-16 md:w-32 md:h-32">
					<Image
						src={user.image}
						width={120}
						height={120}
						className="rounded"
						alt="user profile"
						layout="responsive"
					/>
				</div>
				<div className="flex flex-col justify-center">
					<p className="flex items-center justify-center gap-2 font-bold tracking-wider lowercase md:text-2xl text-md text-primary">
						{user.userName.replaceAll(" ", "")}
						<GoVerified className="text-blue-400" />
					</p>
					<p className="text-xs text-gray-400 capitalize md:text-xl">
						{user.userName}
					</p>
				</div>
			</div>
			<div>
				<div className="flex w-full gap-10 mt-10 mb-10 bg-white border-b-2 border-gray-200">
					<p
						className={`text-xl font-semibold cursor-pointer mt-2 ${videos}`}
						onClick={() => setShowUserVideos(true)}
					>
						Videos
					</p>
					<p
						className={`text-xl font-semibold cursor-pointer mt-2 ${liked}`}
						onClick={() => setShowUserVideos(false)}
					>
						Liked
					</p>
				</div>
				<div className="flex flex-wrap gap-6 md:justify-start">
					{videosList.length > 0 ? (
						videosList.map((post: Video, i: number) => (
							<VideoCard post={post} key={i} />
						))
					) : (
						<NoResults
							text={`No ${showUserVideos ? "" : "Liked"} Videos Yet`}
						/>
					)}
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
	const res = await axios.get(`${BASE_URL}/api/profile/${id}`);

	return {
		props: {
			data: res.data,
		},
	};
};

export default Profile;
