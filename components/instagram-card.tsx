import Image from "next/image";
import type { SocialPost } from "@/lib/social-posts";

function VerifiedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className={className}>
      <circle cx="6" cy="6" r="5.25" fill="#0095F6" />
      <path
        d="M4.25 6L5.5 7.25L7.75 4.75"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M3 5.5h10M3 8h10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

type InstagramCardProps = {
  post: SocialPost;
};

export function InstagramCard({ post }: InstagramCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-between gap-3 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-[#e6e6e6] bg-white">
            <Image
              src={post.avatar}
              alt=""
              fill
              sizes="32px"
              className={`object-cover ${
                post.username === "dpe.moscow" ? "object-center p-1 brightness-0" : "object-top"
              }`}
            />
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-[12px] leading-none text-[#0c0c0c] lowercase">
              {post.username}
            </span>
            {post.verified ? (
              <VerifiedIcon className="size-3 shrink-0" />
            ) : null}
          </div>
        </div>
        <MenuIcon className="size-4 shrink-0 text-[#0c0c0c]" />
      </div>

      <div className="relative aspect-video w-full bg-white sm:aspect-[4/5]">
        <Image
          src={post.image}
          alt={`Публикация ${post.username}`}
          fill
          sizes="(max-width: 640px) 72vw, 300px"
          className="object-cover object-center"
          quality={90}
        />
      </div>
    </>
  );

  if (post.href) {
    return (
      <article className="w-[min(78vw,320px)] shrink-0 snap-start border border-[#e6e6e6] bg-white sm:w-[300px]">
        <a
          href={post.href}
          target="_blank"
          rel="noreferrer"
          className="block transition-opacity hover:opacity-90"
        >
          {content}
        </a>
      </article>
    );
  }

  return (
    <article className="w-[min(78vw,320px)] shrink-0 snap-start border border-[#e6e6e6] bg-white sm:w-[300px]">
      {content}
    </article>
  );
}
