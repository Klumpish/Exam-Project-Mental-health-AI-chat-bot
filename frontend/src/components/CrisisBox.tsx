export default function CrisisBox() {
	return (
		<div>
			<h3 className="text-xl font-bold text-red-300 mb-4">
				⚠️ Need Immediate Help?
			</h3>
			<ul className="space-y-2 text-red-200">
				<li>
					🇪🇺 Emergency Services (EU & Sweden):{' '}
					<strong className="text-white">112</strong> — Dial for immediate help
				</li>
				<li>
					🇸🇪 Suicide Zero (Sweden):{' '}
					<strong className="text-white">90 101 101</strong> or visit{' '}
					<a
						href="https://suicidezero.se"
						className="underline text-white"
						target="_blank"
						rel="noopener noreferrer">
						suicidezero.se
					</a>
				</li>
				<li>
					🇬🇧 The Samaritans (UK & Ireland): Call{' '}
					<strong className="text-white">116 123</strong> or visit{' '}
					<a
						href="https://www.samaritans.org"
						className="underline text-white"
						target="_blank"
						rel="noopener noreferrer">
						samaritans.org
					</a>
				</li>
				<li>
					🌍 International:{' '}
					<a
						href="https://www.iasp.info/resources/Crisis_Centres/"
						className="underline text-white"
						target="_blank"
						rel="noopener noreferrer">
						Find Your Local Hotline
					</a>
				</li>
			</ul>
			<p className="mt-4 text-red-300 font-medium">
				You don’t have to face this alone. Professional help is available 24/7.
			</p>
		</div>
	);
}
