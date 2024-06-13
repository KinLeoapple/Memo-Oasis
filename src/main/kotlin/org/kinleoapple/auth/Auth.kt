package org.kinleoapple.auth

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import java.io.File
import java.security.SecureRandom
import java.util.*


object Auth {
    private var secretKey: ByteArray
    private var algorithm: Algorithm
    private val issuer = "ktor.io"
    private val validityInMs = 3600 * 1000 * 10 // 10 hours

    init {
        val secretKeyFile = File("./secretKey.key")
        if (!secretKeyFile.exists()) {
            initSecretKey(secretKeyFile)
        }
        secretKey = secretKeyFile.readBytes()
        algorithm = Algorithm.HMAC256(secretKey)
    }

    private fun initSecretKey(secretKeyFile: File) {
        val secureRandom = SecureRandom()
        val random = (Math.random() * 10).toInt()
        val secretKey = secureRandom.generateSeed(random)
        secretKeyFile.createNewFile()
        secretKeyFile.writeBytes(secretKey)
    }

    fun makeJwtVerifier(): JWTVerifier = JWT
        .require(algorithm)
        .withIssuer(issuer)
        .build()

    fun sign(name: String, role: Int, ip: String, ua: String): String {
        return makeToken(name, role, ip, ua)
    }

    private fun makeToken(name: String, role: Int, ip: String, ua: String): String = JWT.create()
        .withSubject("Authentication")
        .withIssuer(issuer)
        .withClaim("name", name)
        .withClaim("role", role)
        .withClaim("ip", ip)
        .withClaim("ua", ua)
        .withExpiresAt(getExpiration())
        .sign(algorithm)

    private fun getExpiration() = Date(System.currentTimeMillis() + validityInMs)

}